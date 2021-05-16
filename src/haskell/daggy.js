let {curry} = require('./curry');

const TAGS = Symbol('tags');
const TAG = Symbol('tag');
const VALUES = Symbol('values');

let makeValue = (proto, fields, values) => {
  if (fields.length != values.length) {
    throw new Error();
  } else {
    let obj = Object.create(proto);
    obj[VALUES] = values;
    for (let i = 0; i < fields.length; i++) {
      obj[fields[i]] = values[i];
    }
    return obj;
  }
};

let makeConstructor = (proto, fields) => {
  switch (fields.length) {
    case 1: return (a0) => makeValue(proto, fields, [a0]);
    case 2: return (a0, a1) => makeValue(proto, fields, [a0, a1]);
    case 3: return (a0, a1, a2) => makeValue(proto, fields, [a0, a1, a2]);
    case 4: return (a0, a1, a2, a3) => makeValue(proto, fields, [a0, a1, a2, a3]);
    case 5: return (a0, a1, a2, a3, a4) => makeValue(proto, fields, [a0, a1, a2, a3, a4]);
    case 6: return (a0, a1, a2, a3, a4, a5) => makeValue(proto, fields, [a0, a1, a2, a3, a4, a5]);
    case 7: return (a0, a1, a2, a3, a4, a5, a6) => makeValue(proto, fields, [a0, a1, a2, a3, a4, a5, a6]);
    case 8: return (a0, a1, a2, a3, a4, a5, a6, a7) => makeValue(proto, fields, [a0, a1, a2, a3, a4, a5, a6, a7]);
    case 9: return (a0, a1, a2, a3, a4, a5, a6, a7, a8) => makeValue(proto, fields, [a0, a1, a2, a3, a4, a5, a6, a7, a8]);
    case 10: return (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => makeValue(proto, fields, [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9]);
    default: return (...values) => makeValue(proto, fields, values);
  }
};

let makeConstructorFromObject = (proto, fields) => (
  obj => (
    (values => {
      for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        if (!Object.prototype.hasOwnProperty.call(obj, field)) {
          throw new Error();
        } else {
          Array.prototype.push.call(values, obj[field]);
        }
      }
      return makeValue(proto, fields, values);
    })([])
  )
);

let tagged = (typeName, fields) => {
  let proto = {
    cata: function(f) {
      return Function.prototype.apply.call(f, null, this[VALUES]);
    },
  };
  let typeRep = Object.assign(makeConstructor(proto, fields), {
    from: makeConstructorFromObject(proto, fields),
    cata: curry((type, f) => type.cata(f)),
  });
  typeRep.prototype = proto;
  proto.constructor = typeRep;
  return typeRep;
};

let taggedSum = (typeName, constructors) => (
  (tags => {
    let proto = {
      cata: function(fs) {
        let tags = this.constructor[TAGS];
        for (let i = 0; i < tags.length; i++) {
          let tag = tags[i];
          if (!Object.prototype.hasOwnProperty.call(fs, tag)) {
            throw new Error();
          }
        }
        return Function.prototype.apply.call(fs[this[TAG]], fs, this[VALUES]);
      },
    };
    let typeRep = proto.constructor = {
      cata: curry((type, fs) => type.cata(fs)),
      prototype: proto,
      [TAGS]: tags,
    };
    for (let tag of tags) {
      let fields = constructors[tag];
      let tagProto = Object.create(proto);
      tagProto[TAG] = tag;
      if (fields.length == 0) {
        typeRep[tag] = makeValue(tagProto, fields, []);
      } else {
        typeRep[tag] = Object.assign(makeConstructor(tagProto, fields), {
          from: makeConstructorFromObject(tagProto, fields),
        });
      }
    }
    return typeRep;
  })(Object.keys(constructors))
);

module.exports = {
  tagged,
  taggedSum,
};