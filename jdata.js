/********************************************************************************
     JData Endoer and Decoder for JavaScript
     
     Author: Qianqian Fang <q.fang at neu.edu>
     URL: http://github.com/fangq/jsdata
     
********************************************************************************/

class jdata{
    
    constructor(data={}, options = {}) {
      this.opt  = options;
      this.data = data;
      this._zipper = (typeof pako !== 'undefined'
        ? pako
        : require('pako'));
      this._nj = (typeof nj !== 'undefined'
        ? nj
        : require('numjs'));
    }
    
    encode(){
        this.data=this._encode(this.data);
        return this;
    }
    
    decode(){
        this.data=this._decode(this.data);
        return this;
    }
    
    tojson(){
        return JSON.stringify(this.data, this._exportfilter.bind(this),'\t').replace(/\\/g, '')
            .replace(/\"\[/g, '[')
            .replace(/\]\"/g,']')
            .replace(/\"\{/g, '{')
            .replace(/\}\"/g,'}');
    }
    
    zip(buf, method){
        let str=[].reduce.call(new Uint8Array(buf),function(p,c){
            return p+String.fromCharCode(c)},'');
        if(method==='zlib')
            return btoa(this._zipper.deflate(str, { to: 'string' }));
        else if(method==='gzip')
            return btoa(this._zipper.gzip(str, { to: 'string' }));
        else
            throw "compression method not supported";
    }
    
    unzip(str, method){
        if(method==='zlib')
            return this._zipper.inflate(str, { to: 'string' });
        else if(method==='gzip')
            return this._zipper.ungzip(str, { to: 'string' });
        else
            throw "compression method not supported";
    }
    
    _istypedarray(obj){
      return !!obj && obj.byteLength !== undefined;
    }
    
    static _str2hex(str){
      str = encodeURIComponent(str).split('%').join('');
      return str.toLowerCase();
    }
    
    _exportfilter(k,v){
        if(v instanceof Array){
          return JSON.stringify(v);
        }else if (this._istypedarray(v)){
            return Array.apply([], v);
        }else if(v instanceof this._nj.NdArray){
            return v.tolist();
        }else if(v instanceof Map)
            return Array.from(v.entries());
        return v;
    }
    
    _encode(obj){
        let newobj=obj;
        if(typeof obj == 'number'){
            if(obj === Infinity){
                return "_Inf_";
            }else if (obj === -Infinity){
                return "-_Inf_";
            }else if (obj !== obj){
                return "_NaN_";
            }
        }else if(obj instanceof Array){
            obj.forEach(function(e,idx,orig){
                orig[idx]=this._encode(e);
            }.bind(this));
            newobj=obj;
        }else if(this._istypedarray(obj)){
            let dtype=Object.prototype.toString.call(obj);
            dtype=dtype.replace(/\[object /,'')
                  .replace(/Array\]/,'').replace(/Clamped/,'');
            dtype=dtype.replace(/Float32/,'single').replace(/Float64/,'double');
            newobj={_ArrayType_: dtype.toLowerCase() ,_ArraySize_:obj.length};
            if(this.opt!==undefined && this.opt.hasOwnProperty('compression')){
                newobj._ArrayZipType_=this.opt.compression;
                newobj._ArrayZipSize_=obj.length;
                newobj._ArrayZipData_=this.zip(obj.buffer,this.opt.compression);
            }else{
                newobj._ArrayData_=Array.from(obj);
            }
        }else if(obj instanceof this._nj.NdArray){
            let dtype=obj.dtype;
            dtype=dtype.replace(/float32/,'single').replace(/float64/,'double');
            newobj={_ArrayType_: dtype.toLowerCase() ,_ArraySize_:obj.shape};
            if(this.opt!==undefined && this.opt.hasOwnProperty('compression')){
                newobj._ArrayZipType_=this.opt.compression;
                newobj._ArrayZipSize_=[1, obj.size];
                newobj._ArrayZipData_=this.zip(obj.selection.data.buffer,this.opt.compression);
            }else{
                newobj._ArrayData_=obj.flatten().tolist();
            }
        }else if(obj instanceof Map){
            newobj={_MapData_:[]};
            obj.forEach(function(value, key) {
                 newobj._MapData_.push([ this._encode(key),  this._encode(value)]);
            }.bind(this));
        }else if(typeof obj == 'object' && obj !== null){
            for (var k in obj){
                newobj[k]=this._encode(obj[k]);
            }
        }
        return newobj;
    }

    _decode(obj){
        let newobj=obj;
        if(obj instanceof Array){
            obj.forEach(function(e,idx,orig){
                orig[idx]=this._decode(e);
            }.bind(this));
            newobj=obj;
        }else if(typeof obj == 'object' && obj !== null){
            if(obj.hasOwnProperty('_ArrayType_')){
                let type=obj._ArrayType_;
                let data;
                type=type.replace(/single/,'float32').replace(/double/,'float64');
                let typename=type.charAt(0).toUpperCase() + type.substring(1) + "Array";
                if(obj.hasOwnProperty('_ArrayZipData_')){
                     data=this.unzip(atob(obj._ArrayZipData_),obj._ArrayZipType_);
                     data=Uint8Array.from(data, c => c.charCodeAt(0));
                     
                     data=eval("new "+typename+"(data.buffer)");
                     data=this._nj.array(data,type).reshape(obj._ArraySize_);
                }else if(obj.hasOwnProperty('_ArrayData_')){
                     data=obj._ArrayData_;
                }
                newobj=data;
                return newobj;
            }else if(obj.hasOwnProperty('_MapData_') && Array.isArray(obj._MapData_)){
                newobj=new Map();
                obj._MapData_.forEach(function(e){
                      newobj.set(e[0],e[1]);
                });
                return newobj;
            }else if(obj.hasOwnProperty('_TableData_') && 
                     obj._TableData_.hasOwnProperty('_TableRecords_') &&
                     obj._TableData_._TableRecords_.length){
                newobj={};
                if(obj._TableData_._TableCols_.length==obj._TableData_._TableRecords_[0].length){
                    obj._TableData_._TableCols_.forEach(function(e){
                        newobj[e]=[];
                    });
                    obj._TableRecords_.forEach(function(e){
                          for(let i=0;i<e.length;i++)
                              newobj[obj._TableData_._TableCols_[i]].push(e[i]);
                    });
                }
                return newobj;
            }
            for (var k in obj){
                newobj[k]=this._decode(obj[k]);
            }
        }
        return newobj;
    }
}
