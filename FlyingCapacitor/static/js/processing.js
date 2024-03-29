/*

    P R O C E S S I N G . J S - 0.9.7
    a port of the Processing visualization language

    License       : MIT
    Developer     : John Resig: http://ejohn.org
    Web Site      : http://processingjs.org
    Java Version  : http://processing.org
    Github Repo.  : http://github.com/jeresig/processing-js
    Bug Tracking  : http://processing-js.lighthouseapp.com
    Mozilla POW!  : http://wiki.Mozilla.org/Education/Projects/ProcessingForTheWeb
    Maintained by : Seneca: http://zenit.senecac.on.ca/wiki/index.php/Processing.js
                    Hyper-Metrix: http://hyper-metrix.com/#Processing
                    BuildingSky: http://weare.buildingsky.net/pages/processing-js

 */

(function() {

  var undef; // intentionally left undefined

  var ajax = function ajax(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("If-Modified-Since", "Fri, 1 Jan 1960 00:00:00 GMT");
    xhr.send(null);
    // failed request?
    if (xhr.status !== 200 && xhr.status !== 0) { throw ("XMLHttpRequest failed, status code " + xhr.status); }
    return xhr.responseText;
  };

  /* Browsers fixes start */
  function fixReplaceByRegExp() {
    var re = /t/g;
    if ("t".replace(re,"") !== null && re.exec("t")) {
      return; // it is not necessary
    }
    var _ie_replace = String.prototype.replace;
    String.prototype.replace = function(searchValue, repaceValue) {
      var result = _ie_replace.apply(this, arguments);
      if (searchValue instanceof RegExp && searchValue.global) {
        searchValue.lastIndex = 0;
      }
      return result;
    };
  }

  function fixMatchByRegExp() {
    var re = /t/g;
    if ("t".match(re) !== null && re.exec("t")) {
      return; // it is not necessary
    }
    var _ie_match = String.prototype.match;
    String.prototype.match = function(searchValue) {
      var result = _ie_match.apply(this, arguments);
      if(searchValue instanceof RegExp && searchValue.global) {
        searchValue.lastIndex = 0;
      }
      return result;
    };
  }
  fixReplaceByRegExp();
  fixMatchByRegExp();

  (function fixOperaCreateImageData() {
    try {
      if (!("createImageData" in CanvasRenderingContext2D.prototype)) {
        CanvasRenderingContext2D.prototype.createImageData = function (sw, sh) {
          return new ImageData(sw, sh);
        };
      }
    } catch(e) {}
  }());
  /* Browsers fixes end */

  var PConstants = {
    X: 0,
    Y: 1,
    Z: 2,

    R: 3,
    G: 4,
    B: 5,
    A: 6,

    U: 7,
    V: 8,

    NX: 9,
    NY: 10,
    NZ: 11,

    EDGE: 12,

    // Stroke
    SR: 13,
    SG: 14,
    SB: 15,
    SA: 16,

    SW: 17,

    // Transformations (2D and 3D)
    TX: 18,
    TY: 19,
    TZ: 20,

    VX: 21,
    VY: 22,
    VZ: 23,
    VW: 24,

    // Material properties
    AR: 25,
    AG: 26,
    AB: 27,

    DR: 3,
    DG: 4,
    DB: 5,
    DA: 6,

    SPR: 28,
    SPG: 29,
    SPB: 30,

    SHINE: 31,

    ER: 32,
    EG: 33,
    EB: 34,

    BEEN_LIT: 35,

    VERTEX_FIELD_COUNT: 36,

    // Renderers
    P2D:    1,
    JAVA2D: 1,
    WEBGL:  2,
    P3D:    2,
    OPENGL: 2,
    PDF:    0,
    DXF:    0,

    // Platform IDs
    OTHER:   0,
    WINDOWS: 1,
    MAXOSX:  2,
    LINUX:   3,

    EPSILON: 0.0001,

    MAX_FLOAT:  3.4028235e+38,
    MIN_FLOAT: -3.4028235e+38,
    MAX_INT:    2147483647,
    MIN_INT:   -2147483648,

    PI:         Math.PI,
    TWO_PI:     2 * Math.PI,
    HALF_PI:    Math.PI / 2,
    THIRD_PI:   Math.PI / 3,
    QUARTER_PI: Math.PI / 4,

    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,

    WHITESPACE: " \t\n\r\f\u00A0",

    // Color modes
    RGB:   1,
    ARGB:  2,
    HSB:   3,
    ALPHA: 4,
    CMYK:  5,

    // Image file types
    TIFF:  0,
    TARGA: 1,
    JPEG:  2,
    GIF:   3,

    // Filter/convert types
    BLUR:      11,
    GRAY:      12,
    INVERT:    13,
    OPAQUE:    14,
    POSTERIZE: 15,
    THRESHOLD: 16,
    ERODE:     17,
    DILATE:    18,

    // Blend modes
    REPLACE:    0,
    BLEND:      1 << 0,
    ADD:        1 << 1,
    SUBTRACT:   1 << 2,
    LIGHTEST:   1 << 3,
    DARKEST:    1 << 4,
    DIFFERENCE: 1 << 5,
    EXCLUSION:  1 << 6,
    MULTIPLY:   1 << 7,
    SCREEN:     1 << 8,
    OVERLAY:    1 << 9,
    HARD_LIGHT: 1 << 10,
    SOFT_LIGHT: 1 << 11,
    DODGE:      1 << 12,
    BURN:       1 << 13,

    // Color component bit masks
    ALPHA_MASK: 0xff000000,
    RED_MASK:   0x00ff0000,
    GREEN_MASK: 0x0000ff00,
    BLUE_MASK:  0x000000ff,

    // Projection matrices
    CUSTOM:       0,
    ORTHOGRAPHIC: 2,
    PERSPECTIVE:  3,

    // Shapes
    POINT:          2,
    POINTS:         2,
    LINE:           4,
    LINES:          4,
    TRIANGLE:       8,
    TRIANGLES:      9,
    TRIANGLE_STRIP: 10,
    TRIANGLE_FAN:   11,
    QUAD:           16,
    QUADS:          16,
    QUAD_STRIP:     17,
    POLYGON:        20,
    PATH:           21,
    RECT:           30,
    ELLIPSE:        31,
    ARC:            32,
    SPHERE:         40,
    BOX:            41,

    GROUP:          0,
    PRIMITIVE:      1,
    //PATH:         21, // shared with Shape PATH
    GEOMETRY:       3,

    // Shape Vertex
    VERTEX:        0,
    BEZIER_VERTEX: 1,
    CURVE_VERTEX:  2,
    BREAK:         3,
    CLOSESHAPE:    4,

    // Shape closing modes
    OPEN:  1,
    CLOSE: 2,

    // Shape drawing modes
    CORNER:          0, // Draw mode convention to use (x, y) to (width, height)
    CORNERS:         1, // Draw mode convention to use (x1, y1) to (x2, y2) coordinates
    RADIUS:          2, // Draw mode from the center, and using the radius
    CENTER_RADIUS:   2, // Deprecated! Use RADIUS instead
    CENTER:          3, // Draw from the center, using second pair of values as the diameter
    DIAMETER:        3, // Synonym for the CENTER constant. Draw from the center
    CENTER_DIAMETER: 3, // Deprecated! Use DIAMETER instead

    // Text vertical alignment modes
    BASELINE: 0,   // Default vertical alignment for text placement
    TOP:      101, // Align text to the top
    BOTTOM:   102, // Align text from the bottom, using the baseline

    // UV Texture coordinate modes
    NORMAL:     1,
    NORMALIZED: 1,
    IMAGE:      2,

    // Text placement modes
    MODEL: 4,
    SHAPE: 5,

    // Stroke modes
    SQUARE:  'butt',
    ROUND:   'round',
    PROJECT: 'square',
    MITER:   'miter',
    BEVEL:   'bevel',

    // Lighting modes
    AMBIENT:     0,
    DIRECTIONAL: 1,
    //POINT:     2, Shared with Shape constant
    SPOT:        3,

    // Key constants

    // Both key and keyCode will be equal to these values
    BACKSPACE: 8,
    TAB:       9,
    ENTER:     10,
    RETURN:    13,
    ESC:       27,
    DELETE:    127,
    CODED:     0xffff,

    // p.key will be CODED and p.keyCode will be this value
    SHIFT:     16,
    CONTROL:   17,
    ALT:       18,
    UP:        38,
    RIGHT:     39,
    DOWN:      40,
    LEFT:      37,

    // Cursor types
    ARROW:    'default',
    CROSS:    'crosshair',
    HAND:     'pointer',
    MOVE:     'move',
    TEXT:     'text',
    WAIT:     'wait',
    NOCURSOR: "url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), auto",

    // Hints
    DISABLE_OPENGL_2X_SMOOTH:     1,
    ENABLE_OPENGL_2X_SMOOTH:     -1,
    ENABLE_OPENGL_4X_SMOOTH:      2,
    ENABLE_NATIVE_FONTS:          3,
    DISABLE_DEPTH_TEST:           4,
    ENABLE_DEPTH_TEST:           -4,
    ENABLE_DEPTH_SORT:            5,
    DISABLE_DEPTH_SORT:          -5,
    DISABLE_OPENGL_ERROR_REPORT:  6,
    ENABLE_OPENGL_ERROR_REPORT:  -6,
    ENABLE_ACCURATE_TEXTURES:     7,
    DISABLE_ACCURATE_TEXTURES:   -7,
    HINT_COUNT:                  10,

    // PJS defined constants
    SINCOS_LENGTH:      parseInt(360 / 0.5, 10),
    PRECISIONB:         15, // fixed point precision is limited to 15 bits!!
    PRECISIONF:         1 << 15,
    PREC_MAXVAL:        (1 << 15) - 1,
    PREC_ALPHA_SHIFT:   24 - 15,
    PREC_RED_SHIFT:     16 - 15,
    NORMAL_MODE_AUTO:   0,
    NORMAL_MODE_SHAPE:  1,
    NORMAL_MODE_VERTEX: 2,
    MAX_LIGHTS:         8
  };

  // Typed Arrays: fallback to WebGL arrays or Native JS arrays if unavailable
  function setupTypedArray(name, fallback) {
    // check if TypedArray exists
    if (typeof this[name] !== "function") {
      // nope.. check if WebGLArray exists
      if (typeof this[fallback] === "function") {
        this[name] = this[fallback];
      } else {
        // nope.. set as Native JS array
        this[name] = function(obj) {
          if (obj instanceof Array) {
            return obj;
          } else if (typeof obj === "number") {
            return new Array(obj);
          }
        };
      }
    }
  }

  setupTypedArray("Float32Array", "WebGLFloatArray");
  setupTypedArray("Uint16Array",  "WebGLUnsignedShortArray");
  setupTypedArray("Uint8Array",   "WebGLUnsignedByteArray");

  var ArrayList = function() {
    function createArrayList(args) {
      var arr = [];
      for (var i = 0; i < args[0]; i++) {
        arr[i] = (args.length > 1 ? createArrayList(args.slice(1)) : 0 );
      }

      arr.get = function(i) {
        return this[i];
      };

      arr.contains = function(item) {
        return this.indexOf(item) !== -1;
      };

      arr.add = function() {
        if (arguments.length === 1) {
          this.push(arguments[0]); // for add(Object)
        } else if (arguments.length === 2) {
          if (typeof arguments[0] === 'number') {
            if (arguments[0] >= 0 && arguments[0] <= this.length) {
              this.splice(arguments[0], 0, arguments[1]); // for add(i, Object)
            } else {
              throw(arguments[0] + " is not a valid index");
            }
          } else {
            throw(typeof arguments[0] + " is not a number");
          }
        } else {
          throw("Please use the proper number of parameters.");
        }
      };

      arr.set = function() {
        if (arguments.length === 2) {
          if (typeof arguments[0] === 'number') {
            if (arguments[0] >= 0 && arguments[0] < this.length) {
              this.splice(arguments[0], 1, arguments[1]);
            } else {
              throw(arguments[0] + " is not a valid index.");
            }
          } else {
            throw(typeof arguments[0] + " is not a number");
          }
        } else {
          throw("Please use the proper number of parameters.");
        }
      };

      arr.size = function() {
        return this.length;
      };

      arr.clear = function() {
        this.length = 0;
      };

      arr.remove = function(i) {
        return this.splice(i, 1)[0];
      };

      arr.isEmpty = function() {
        return !this.length;
      };

      arr.clone = function() {
        return this.slice(0);
      };

      arr.toArray = function() {
        return this.slice(0);
      };

      return arr;
    }

    return createArrayList(Array.prototype.slice.call(arguments));
  };

  var HashMap = (function() {
    function virtHashCode(obj) {
      if (obj.constructor === String) {
        var hash = 0;
        for (var i = 0; i < obj.length; ++i) {
          hash = (hash * 31 + obj.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash;
      } else if (typeof(obj) !== "object") {
        return obj & 0xFFFFFFFF;
      } else if ("hashCode" in obj) {
        return obj.hashCode.call(obj);
      } else {
        if (obj.$id === undef) {
          obj.$id = ((Math.floor(Math.random() * 0x10000) - 0x8000) << 16) | Math.floor(Math.random() * 0x10000);
        }
        return obj.$id;
      }
    }

    function virtEquals(obj, other) {
      if (obj === null || other === null) {
        return (obj === null) && (other === null);
      } else if (obj.constructor === String) {
        return obj === other;
      } else if (typeof(obj) !== "object") {
        return obj === other;
      } else if ("equals" in obj) {
        return obj.equals.call(obj, other);
      } else {
        return obj === other;
      }
    }

    function HashMap() {
      if (arguments.length === 1 && arguments[0].constructor === HashMap) {
        return arguments[0].clone();
      }

      var initialCapacity = arguments.length > 0 ? arguments[0] : 16;
      var loadFactor = arguments.length > 1 ? arguments[1] : 0.75;
      var buckets = new Array(initialCapacity);
      var count = 0;
      var hashMap = this;

      function ensureLoad() {
        if (count <= loadFactor * buckets.length) {
          return;
        }
        var allEntries = [];
        for (var i = 0; i < buckets.length; ++i) {
          if (buckets[i] !== undef) {
            allEntries = allEntries.concat(buckets[i]);
          }
        }
        buckets = new Array(buckets.length * 2);
        for (var j = 0; j < allEntries.length; ++j) {
          var index = virtHashCode(allEntries[j].key) % buckets.length;
          var bucket = buckets[index];
          if (bucket === undef) {
            buckets[index] = bucket = [];
          }
          bucket.push(allEntries[j]);
        }
      }

      function Iterator(conversion, removeItem) {
        var bucketIndex = 0;
        var itemIndex = -1;
        var endOfBuckets = false;

        function findNext() {
          while (!endOfBuckets) {
            ++itemIndex;
            if (bucketIndex >= buckets.length) {
              endOfBuckets = true;
            } else if (buckets[bucketIndex] === undef || itemIndex >= buckets[bucketIndex].length) {
              itemIndex = -1;
              ++bucketIndex;
            } else {
              return;
            }
          }
        }

        this.hasNext = function() {
          return !endOfBuckets;
        };

        this.next = function() {
          var result = conversion(buckets[bucketIndex][itemIndex]);
          findNext();
          return result;
        };

        this.remove = function() {
          removeItem(this.next());
          --itemIndex;
        };

        findNext();
      }

      function Set(conversion, isIn, removeItem) {
        this.clear = function() {
          hashMap.clear();
        };

        this.contains = function(o) {
          return isIn(o);
        };

        this.containsAll = function(o) {
          var it = o.iterator();
          while (it.hasNext()) {
            if (!this.contains(it.next())) {
              return false;
            }
          }
          return true;
        };

        this.isEmpty = function() {
          return hashMap.isEmpty();
        };

        this.iterator = function() {
          return new Iterator(conversion, removeItem);
        };

        this.remove = function(o) {
          if (this.contains(o)) {
            removeItem(o);
            return true;
          }
          return false;
        };

        this.removeAll = function(c) {
          var it = c.iterator();
          var changed = false;
          while (it.hasNext()) {
            var item = it.next();
            if (this.contains(item)) {
              removeItem(item);
              changed = true;
            }
          }
          return true;
        };

        this.retainAll = function(c) {
          var it = this.iterator();
          var toRemove = [];
          while (it.hasNext()) {
            var entry = it.next();
            if (!c.contains(entry)) {
              toRemove.push(entry);
            }
          }
          for (var i = 0; i < toRemove.length; ++i) {
            removeItem(toRemove[i]);
          }
          return toRemove.length > 0;
        };

        this.size = function() {
          return hashMap.size();
        };

        this.toArray = function() {
          var result = new ArrayList(0);
          var it = this.iterator();
          while (it.hasNext()) {
            result.push(it.next());
          }
          return result;
        };
      }

      function Entry(pair) {
        this._isIn = function(map) {
          return map === hashMap && (pair.removed === undef);
        };

        this.equals = function(o) {
          return virtEquals(pair.key, o.getKey());
        };

        this.getKey = function() {
          return pair.key;
        };

        this.getValue = function() {
          return pair.value;
        };

        this.hashCode = function(o) {
          return virtHashCode(pair.key);
        };

        this.setValue = function(value) {
          var old = pair.value;
          pair.value = value;
          return old;
        };
      }

      this.clear = function() {
        count = 0;
        buckets = new Array(initialCapacity);
      };

      this.clone = function() {
        var map = new HashMap();
        map.putAll(this);
        return map;
      };

      this.containsKey = function(key) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          return false;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            return true;
          }
        }
        return false;
      };

      this.containsValue = function(value) {
        for (var i = 0; i < buckets.length; ++i) {
          var bucket = buckets[i];
          if (bucket === undef) {
            continue;
          }
          for (var j = 0; j < bucket.length; ++j) {
            if (virtEquals(bucket[j].value, value)) {
              return true;
            }
          }
        }
        return false;
      };

      this.entrySet = function() {
        return new Set(

        function(pair) {
          return new Entry(pair);
        },

        function(pair) {
          return pair.constructor === Entry && pair._isIn(hashMap);
        },

        function(pair) {
          return hashMap.remove(pair.getKey());
        });
      };

      this.get = function(key) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          return null;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            return bucket[i].value;
          }
        }
        return null;
      };

      this.isEmpty = function() {
        return count === 0;
      };

      this.keySet = function() {
        return new Set(

        function(pair) {
          return pair.key;
        },

        function(key) {
          return hashMap.containsKey(key);
        },

        function(key) {
          return hashMap.remove(key);
        });
      };

      this.put = function(key, value) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          ++count;
          buckets[index] = [{
            key: key,
            value: value
          }];
          ensureLoad();
          return null;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            var previous = bucket[i].value;
            bucket[i].value = value;
            return previous;
          }
        }
        ++count;
        bucket.push({
          key: key,
          value: value
        });
        ensureLoad();
        return null;
      };

      this.putAll = function(m) {
        var it = m.entrySet().iterator();
        while (it.hasNext()) {
          var entry = it.next();
          this.put(entry.getKey(), entry.getValue());
        }
      };

      this.remove = function(key) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          return null;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            --count;
            var previous = bucket[i].value;
            bucket[i].removed = true;
            if (bucket.length > 1) {
              bucket.splice(i, 1);
            } else {
              buckets[index] = undef;
            }
            return previous;
          }
        }
        return null;
      };

      this.size = function() {
        return count;
      };

      this.values = function() {
        var result = new ArrayList(0);
        var it = this.entrySet().iterator();
        while (it.hasNext()) {
          var entry = it.next();
          result.push(entry.getValue());
        }
        return result;
      };
    }

    return HashMap;
  }());

  var PVector = (function() {
    function PVector(x, y, z) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }

    function createPVectorMethod(method) {
      return function(v1, v2) {
        var v = v1.get();
        v[method](v2);
        return v;
      };
    }

    function createSimplePVectorMethod(method) {
      return function(v1, v2) {
        return v1[method](v2);
      };
    }

    var simplePVMethods = "dist dot cross".split(" ");
    var method = simplePVMethods.length;

    PVector.angleBetween = function(v1, v2) {
      return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
    };

    // Common vector operations for PVector
    PVector.prototype = {
      set: function(v, y, z) {
        if (arguments.length === 1) {
          this.set(v.x || v[0], v.y || v[1], v.z || v[2]);
        } else {
          this.x = v;
          this.y = y;
          this.z = z;
        }
      },
      get: function() {
        return new PVector(this.x, this.y, this.z);
      },
      mag: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      },
      add: function(v, y, z) {
        if (arguments.length === 3) {
          this.x += v;
          this.y += y;
          this.z += z;
        } else if (arguments.length === 1) {
          this.x += v.x;
          this.y += v.y;
          this.z += v.z;
        }
      },
      sub: function(v, y, z) {
        if (arguments.length === 3) {
          this.x -= v;
          this.y -= y;
          this.z -= z;
        } else if (arguments.length === 1) {
          this.x -= v.x;
          this.y -= v.y;
          this.z -= v.z;
        }
      },
      mult: function(v) {
        if (typeof v === 'number') {
          this.x *= v;
          this.y *= v;
          this.z *= v;
        } else if (typeof v === 'object') {
          this.x *= v.x;
          this.y *= v.y;
          this.z *= v.z;
        }
      },
      div: function(v) {
        if (typeof v === 'number') {
          this.x /= v;
          this.y /= v;
          this.z /= v;
        } else if (typeof v === 'object') {
          this.x /= v.x;
          this.y /= v.y;
          this.z /= v.z;
        }
      },
      dist: function(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      },
      dot: function(v, y, z) {
        if (arguments.length === 3) {
          return (this.x * v + this.y * y + this.z * z);
        } else if (arguments.length === 1) {
          return (this.x * v.x + this.y * v.y + this.z * v.z);
        }
      },
      cross: function(v) {
        return new PVector(this.y * v.z - v.y * this.z,
                           this.z * v.x - v.z * this.x,
                           this.x * v.y - v.x * this.y);
      },
      normalize: function() {
        var m = this.mag();
        if (m > 0) {
          this.div(m);
        }
      },
      limit: function(high) {
        if (this.mag() > high) {
          this.normalize();
          this.mult(high);
        }
      },
      heading2D: function() {
        return (-Math.atan2(-this.y, this.x));
      },
      toString: function() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
      },
      array: function() {
        return [this.x, this.y, this.z];
      }
    };

    while (method--) {
      PVector[simplePVMethods[method]] = createSimplePVectorMethod(simplePVMethods[method]);
    }

    for (method in PVector.prototype) {
      if (PVector.prototype.hasOwnProperty(method) && !PVector.hasOwnProperty(method)) {
        PVector[method] = createPVectorMethod(method);
      }
    }

    return PVector;
  }());

  var Processing = this.Processing = function Processing(curElement, aCode) {
    var p = this;

    // Include Package Classes -- do this differently in the future.
    p.ArrayList   = ArrayList;
    p.HashMap     = HashMap;
    p.PVector     = PVector;
    //p.PImage    = PImage;     // TODO
    //p.PShape    = PShape;     // TODO
    //p.PShapeSVG = PShapeSVG;  // TODO

    // PJS specific (non-p5) methods and properties to externalize
    p.externals = {
      canvas:  curElement,
      context: undef,
      sketch:  undef,
      onblur:  function() {},
      onfocus: function() {}
    };

    p.name            = 'Processing.js Instance'; // Set Processing defaults / environment variables
    p.use3DContext    = false; // default '2d' canvas context

    p.focused         = true;
    p.breakShape      = false;

    // Glyph path storage for textFonts
    p.glyphTable      = {};

    // Global vars for tracking mouse position
    p.pmouseX         = 0;
    p.pmouseY         = 0;
    p.mouseX          = 0;
    p.mouseY          = 0;
    p.mouseButton     = 0;
    p.mouseScroll     = 0;

    // Undefined event handlers to be replaced by user when needed
    p.mouseClicked    = undef;
    p.mouseDragged    = undef;
    p.mouseMoved      = undef;
    p.mousePressed    = undef;
    p.mouseReleased   = undef;
    p.mouseScrolled   = undef;
    p.key             = undef;
    p.keyCode         = undef;
    p.keyPressed      = undef;
    p.keyReleased     = undef;
    p.keyTyped        = undef;
    p.draw            = undef;
    p.setup           = undef;

    // Remapped vars
    p.__mousePressed  = false;
    p.__keyPressed    = false;
    p.__frameRate     = 0;

    // The current animation frame
    p.frameCount      = 0;

    // The height/width of the canvas
    p.width           = curElement.width  - 0;
    p.height          = curElement.height - 0;

    p.defineProperty = function(obj, name, desc) {
      if("defineProperty" in Object) {
        Object.defineProperty(obj, name, desc);
      } else {
        if (desc.hasOwnProperty("get")) {
          obj.__defineGetter__(name, desc.get);
        }
        if (desc.hasOwnProperty("set")) {
          obj.__defineSetter__(name, desc.set);
        }
      }
    };

    // "Private" variables used to maintain state
    var curContext,
        curSketch,
        online = true,
        doFill = true,
        fillStyle = [1.0, 1.0, 1.0, 1.0],
        currentFillColor = 0xFFFFFFFF,
        isFillDirty = true,
        doStroke = true,
        strokeStyle = [0.8, 0.8, 0.8, 1.0],
        currentStrokeColor = 0xFFFDFDFD,
        isStrokeDirty = true,
        lineWidth = 1,
        loopStarted = false,
        doLoop = true,
        looping = 0,
        curRectMode = PConstants.CORNER,
        curEllipseMode = PConstants.CENTER,
        normalX = 0,
        normalY = 0,
        normalZ = 0,
        normalMode = PConstants.NORMAL_MODE_AUTO,
        inDraw = false,
        curFrameRate = 60,
        curCursor = PConstants.ARROW,
        oldCursor = curElement.style.cursor,
        curMsPerFrame = 1,
        curShape = PConstants.POLYGON,
        curShapeCount = 0,
        curvePoints = [],
        curTightness = 0,
        curveDet = 20,
        curveInited = false,
        bezDetail = 20,
        colorModeA = 255,
        colorModeX = 255,
        colorModeY = 255,
        colorModeZ = 255,
        pathOpen = false,
        mouseDragging = false,
        curColorMode = PConstants.RGB,
        curTint = function() {},
        curTextSize = 12,
        curTextFont = "Arial",
        getLoaded = false,
        start = new Date().getTime(),
        timeSinceLastFPS = start,
        framesSinceLastFPS = 0,
        textcanvas,
        curveBasisMatrix,
        curveToBezierMatrix,
        curveDrawMatrix,
        bezierDrawMatrix,
        bezierBasisInverse,
        bezierBasisMatrix,
        // Shaders
        programObject3D,
        programObject2D,
        programObjectUnlitShape,
        boxBuffer,
        boxNormBuffer,
        boxOutlineBuffer,
        rectBuffer,
        rectNormBuffer,
        sphereBuffer,
        lineBuffer,
        fillBuffer,
        fillColorBuffer,
        strokeColorBuffer,
        pointBuffer,
        shapeTexVBO,
        canTex,   // texture for createGraphics
        curTexture = {width:0,height:0},
        curTextureMode = PConstants.IMAGE,
        usingTexture = false,
        textBuffer,
        textureBuffer,
        indexBuffer,
        // Text alignment
        horizontalTextAlignment = PConstants.LEFT,
        verticalTextAlignment = PConstants.BASELINE,
        baselineOffset = 0.2, // percent
        tMode = PConstants.MODEL,
        // Pixels cache
        originalContext,
        proxyContext = null,
        isContextReplaced = false,
        setPixelsCached,
        maxPixelsCached = 1000,
        codedKeys = [PConstants.SHIFT, PConstants.CONTROL, PConstants.ALT, PConstants.UP, PConstants.RIGHT, PConstants.DOWN, PConstants.LEFT];

    // Get padding and border style widths for mouse offsets
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

    if (document.defaultView && document.defaultView.getComputedStyle) {
      stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(curElement, null)['paddingLeft'], 10)      || 0;
      stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(curElement, null)['paddingTop'], 10)       || 0;
      styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(curElement, null)['borderLeftWidth'], 10)  || 0;
      styleBorderTop   = parseInt(document.defaultView.getComputedStyle(curElement, null)['borderTopWidth'], 10)   || 0;
    }

    // User can only have MAX_LIGHTS lights
    var lightCount = 0;

    //sphere stuff
    var sphereDetailV = 0,
        sphereDetailU = 0,
        sphereX = [],
        sphereY = [],
        sphereZ = [],
        sinLUT = new Array(PConstants.SINCOS_LENGTH),
        cosLUT = new Array(PConstants.SINCOS_LENGTH),
        sphereVerts,
        sphereNorms;

    // Camera defaults and settings
    var cam,
        cameraInv,
        forwardTransform,
        reverseTransform,
        modelView,
        modelViewInv,
        userMatrixStack,
        inverseCopy,
        projection,
        manipulatingCamera = false,
        frustumMode = false,
        cameraFOV = 60 * (Math.PI / 180),
        cameraX = curElement.width / 2,
        cameraY = curElement.height / 2,
        cameraZ = cameraY / Math.tan(cameraFOV / 2),
        cameraNear = cameraZ / 10,
        cameraFar = cameraZ * 10,
        cameraAspect = curElement.width / curElement.height;

    var vertArray = [],
        curveVertArray = [],
        curveVertCount = 0,
        isCurve = false,
        isBezier = false,
        firstVert = true;

    //PShape stuff
    var curShapeMode = PConstants.CORNER;

    var colors = {
      aliceblue:            "#f0f8ff",
      antiquewhite:         "#faebd7",
      aqua:                 "#00ffff",
      aquamarine:           "#7fffd4",
      azure:                "#f0ffff",
      beige:                "#f5f5dc",
      bisque:               "#ffe4c4",
      black:                "#000000",
      blanchedalmond:       "#ffebcd",
      blue:                 "#0000ff",
      blueviolet:           "#8a2be2",
      brown:                "#a52a2a",
      burlywood:            "#deb887",
      cadetblue:            "#5f9ea0",
      chartreuse:           "#7fff00",
      chocolate:            "#d2691e",
      coral:                "#ff7f50",
      cornflowerblue:       "#6495ed",
      cornsilk:             "#fff8dc",
      crimson:              "#dc143c",
      cyan:                 "#00ffff",
      darkblue:             "#00008b",
      darkcyan:             "#008b8b",
      darkgoldenrod:        "#b8860b",
      darkgray:             "#a9a9a9",
      darkgreen:            "#006400",
      darkkhaki:            "#bdb76b",
      darkmagenta:          "#8b008b",
      darkolivegreen:       "#556b2f",
      darkorange:           "#ff8c00",
      darkorchid:           "#9932cc",
      darkred:              "#8b0000",
      darksalmon:           "#e9967a",
      darkseagreen:         "#8fbc8f",
      darkslateblue:        "#483d8b",
      darkslategray:        "#2f4f4f",
      darkturquoise:        "#00ced1",
      darkviolet:           "#9400d3",
      deeppink:             "#ff1493",
      deepskyblue:          "#00bfff",
      dimgray:              "#696969",
      dodgerblue:           "#1e90ff",
      firebrick:            "#b22222",
      floralwhite:          "#fffaf0",
      forestgreen:          "#228b22",
      fuchsia:              "#ff00ff",
      gainsboro:            "#dcdcdc",
      ghostwhite:           "#f8f8ff",
      gold:                 "#ffd700",
      goldenrod:            "#daa520",
      gray:                 "#808080",
      green:                "#008000",
      greenyellow:          "#adff2f",
      honeydew:             "#f0fff0",
      hotpink:              "#ff69b4",
      indianred:            "#cd5c5c",
      indigo:               "#4b0082",
      ivory:                "#fffff0",
      khaki:                "#f0e68c",
      lavender:             "#e6e6fa",
      lavenderblush:        "#fff0f5",
      lawngreen:            "#7cfc00",
      lemonchiffon:         "#fffacd",
      lightblue:            "#add8e6",
      lightcoral:           "#f08080",
      lightcyan:            "#e0ffff",
      lightgoldenrodyellow: "#fafad2",
      lightgrey:            "#d3d3d3",
      lightgreen:           "#90ee90",
      lightpink:            "#ffb6c1",
      lightsalmon:          "#ffa07a",
      lightseagreen:        "#20b2aa",
      lightskyblue:         "#87cefa",
      lightslategray:       "#778899",
      lightsteelblue:       "#b0c4de",
      lightyellow:          "#ffffe0",
      lime:                 "#00ff00",
      limegreen:            "#32cd32",
      linen:                "#faf0e6",
      magenta:              "#ff00ff",
      maroon:               "#800000",
      mediumaquamarine:     "#66cdaa",
      mediumblue:           "#0000cd",
      mediumorchid:         "#ba55d3",
      mediumpurple:         "#9370d8",
      mediumseagreen:       "#3cb371",
      mediumslateblue:      "#7b68ee",
      mediumspringgreen:    "#00fa9a",
      mediumturquoise:      "#48d1cc",
      mediumvioletred:      "#c71585",
      midnightblue:         "#191970",
      mintcream:            "#f5fffa",
      mistyrose:            "#ffe4e1",
      moccasin:             "#ffe4b5",
      navajowhite:          "#ffdead",
      navy:                 "#000080",
      oldlace:              "#fdf5e6",
      olive:                "#808000",
      olivedrab:            "#6b8e23",
      orange:               "#ffa500",
      orangered:            "#ff4500",
      orchid:               "#da70d6",
      palegoldenrod:        "#eee8aa",
      palegreen:            "#98fb98",
      paleturquoise:        "#afeeee",
      palevioletred:        "#d87093",
      papayawhip:           "#ffefd5",
      peachpuff:            "#ffdab9",
      peru:                 "#cd853f",
      pink:                 "#ffc0cb",
      plum:                 "#dda0dd",
      powderblue:           "#b0e0e6",
      purple:               "#800080",
      red:                  "#ff0000",
      rosybrown:            "#bc8f8f",
      royalblue:            "#4169e1",
      saddlebrown:          "#8b4513",
      salmon:               "#fa8072",
      sandybrown:           "#f4a460",
      seagreen:             "#2e8b57",
      seashell:             "#fff5ee",
      sienna:               "#a0522d",
      silver:               "#c0c0c0",
      skyblue:              "#87ceeb",
      slateblue:            "#6a5acd",
      slategray:            "#708090",
      snow:                 "#fffafa",
      springgreen:          "#00ff7f",
      steelblue:            "#4682b4",
      tan:                  "#d2b48c",
      teal:                 "#008080",
      thistle:              "#d8bfd8",
      tomato:               "#ff6347",
      turquoise:            "#40e0d0",
      violet:               "#ee82ee",
      wheat:                "#f5deb3",
      white:                "#ffffff",
      whitesmoke:           "#f5f5f5",
      yellow:               "#ffff00",
      yellowgreen:          "#9acd32"
    };

    // Stores states for pushStyle() and popStyle().
    var styleArray = new Array(0);

    // Vertices are specified in a counter-clockwise order
    // triangles are in this order: back, front, right, bottom, left, top
    var boxVerts = new Float32Array([
       0.5,  0.5, -0.5,  0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
      -0.5, -0.5,  0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,
       0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5,
       0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5,
      -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,
      -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
      -0.5,  0.5, -0.5, -0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
      -0.5,  0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5]);

    var boxOutlineVerts = new Float32Array([
       0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5, -0.5, -0.5, -0.5, -0.5,  0.5,  0.5, -0.5, -0.5,  0.5,
       0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5, -0.5, -0.5,  0.5, -0.5,
      -0.5,  0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,
       0.5, -0.5,  0.5,  0.5, -0.5, -0.5,  0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
      -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5]);

    var boxNorms = new Float32Array([
       0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,
       0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,
       1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,
       0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,
      -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0,
       0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0]);

    // These verts are used for the fill and stroke using TRIANGLE_FAN and LINE_LOOP
    var rectVerts = new Float32Array([0,0,0, 0,1,0, 1,1,0, 1,0,0]);

    var rectNorms = new Float32Array([0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1]);

    // Vertex shader for points and lines
    var vShaderSrcUnlitShape =
      "varying vec4 frontColor;" +

      "attribute vec3 aVertex;" +
      "attribute vec4 aColor;" +

      "uniform mat4 uView;" +
      "uniform mat4 uProjection;" +

      "void main(void) {" +
      "  frontColor = aColor;" +
      "  gl_Position = uProjection * uView * vec4(aVertex, 1.0);" +
      "}";

    var fShaderSrcUnlitShape =
      "#ifdef GL_ES\n" +
      "precision highp float;\n" +
      "#endif\n" +

      "varying vec4 frontColor;" +

      "void main(void){" +
      "  gl_FragColor = frontColor;" +
      "}";

    // Vertex shader for points and lines
    var vertexShaderSource2D =
      "varying vec4 frontColor;" +

      "attribute vec3 Vertex;" +
      "attribute vec2 aTextureCoord;" +
      "uniform vec4 color;" +

      "uniform mat4 model;" +
      "uniform mat4 view;" +
      "uniform mat4 projection;" +
      "uniform float pointSize;" +
      "varying vec2 vTextureCoord;"+

      "void main(void) {" +
      "  gl_PointSize = pointSize;" +
      "  frontColor = color;" +
      "  gl_Position = projection * view * model * vec4(Vertex, 1.0);" +
      "  vTextureCoord = aTextureCoord;" +
      "}";

    var fragmentShaderSource2D =
      "#ifdef GL_ES\n" +
      "precision highp float;\n" +
      "#endif\n" +

      "varying vec4 frontColor;" +
      "varying vec2 vTextureCoord;"+

      "uniform sampler2D uSampler;"+
      "uniform int picktype;"+

      "void main(void){" +
      "  if(picktype == 0){"+
      "    gl_FragColor = frontColor;" +
      "  }" +
      "  else if(picktype == 1){"+
      "    float alpha = texture2D(uSampler, vTextureCoord).a;"+
      "    gl_FragColor = vec4(frontColor.rgb*alpha, alpha);\n"+
      "  }"+
      "}";

    // Vertex shader for boxes and spheres
    var vertexShaderSource3D =
      "varying vec4 frontColor;" +

      "attribute vec3 Vertex;" +
      "attribute vec3 Normal;" +
      "attribute vec4 aColor;" +
      "attribute vec2 aTexture;" +
      "varying   vec2 vTexture;" +

      "uniform vec4 color;" +

      "uniform bool usingMat;" +
      "uniform vec3 specular;" +
      "uniform vec3 mat_emissive;" +
      "uniform vec3 mat_ambient;" +
      "uniform vec3 mat_specular;" +
      "uniform float shininess;" +

      "uniform mat4 model;" +
      "uniform mat4 view;" +
      "uniform mat4 projection;" +
      "uniform mat4 normalTransform;" +

      "uniform int lightCount;" +
      "uniform vec3 falloff;" +

      "struct Light {" +
      "  bool dummy;" +
      "  int type;" +
      "  vec3 color;" +
      "  vec3 position;" +
      "  vec3 direction;" +
      "  float angle;" +
      "  vec3 halfVector;" +
      "  float concentration;" +
      "};" +
      "uniform Light lights[8];" +

      "void AmbientLight( inout vec3 totalAmbient, in vec3 ecPos, in Light light ) {" +
      // Get the vector from the light to the vertex
      // Get the distance from the current vector to the light position
      "  float d = length( light.position - ecPos );" +
      "  float attenuation = 1.0 / ( falloff[0] + ( falloff[1] * d ) + ( falloff[2] * d * d ));" + "  totalAmbient += light.color * attenuation;" +
      "}" +

      "void DirectionalLight( inout vec3 col, in vec3 ecPos, inout vec3 spec, in vec3 vertNormal, in Light light ) {" +
      "  float powerfactor = 0.0;" +
      "  float nDotVP = max(0.0, dot( vertNormal, light.position ));" +
      "  float nDotVH = max(0.0, dot( vertNormal, normalize( light.position-ecPos )));" +

      "  if( nDotVP != 0.0 ){" +
      "    powerfactor = pow( nDotVH, shininess );" +
      "  }" +

      "  col += light.color * nDotVP;" +
      "  spec += specular * powerfactor;" +
      "}" +

      "void PointLight( inout vec3 col, inout vec3 spec, in vec3 vertNormal, in vec3 ecPos, in vec3 eye, in Light light ) {" +
      "  float powerfactor;" +

      // Get the vector from the light to the vertex
      "   vec3 VP = light.position - ecPos;" +

      // Get the distance from the current vector to the light position
      "  float d = length( VP ); " +

      // Normalize the light ray so it can be used in the dot product operation.
      "  VP = normalize( VP );" +

      "  float attenuation = 1.0 / ( falloff[0] + ( falloff[1] * d ) + ( falloff[2] * d * d ));" +

      "  float nDotVP = max( 0.0, dot( vertNormal, VP ));" +
      "  vec3 halfVector = normalize( VP + eye );" +
      "  float nDotHV = max( 0.0, dot( vertNormal, halfVector ));" +

      "  if( nDotVP == 0.0) {" +
      "    powerfactor = 0.0;" +
      "  }" +
      "  else{" +
      "    powerfactor = pow( nDotHV, shininess );" +
      "  }" +

      "  spec += specular * powerfactor * attenuation;" +
      "  col += light.color * nDotVP * attenuation;" +
      "}" +

      /*
      */
      "void SpotLight( inout vec3 col, inout vec3 spec, in vec3 vertNormal, in vec3 ecPos, in vec3 eye, in Light light ) {" +
      "  float spotAttenuation;" +
      "  float powerfactor;" +

      // calculate the vector from the current vertex to the light.
      "  vec3 VP = light.position - ecPos; " +
      "  vec3 ldir = normalize( light.direction );" +

      // get the distance from the spotlight and the vertex
      "  float d = length( VP );" +
      "  VP = normalize( VP );" +

      "  float attenuation = 1.0 / ( falloff[0] + ( falloff[1] * d ) + ( falloff[2] * d * d ) );" +

      // dot product of the vector from vertex to light and light direction.
      "  float spotDot = dot( VP, ldir );" +

      // if the vertex falls inside the cone
      "  if( spotDot < cos( light.angle ) ) {" +
      "    spotAttenuation = pow( spotDot, light.concentration );" +
      "  }" +
      "  else{" +
      "    spotAttenuation = 1.0;" +
      "  }" +
      "  attenuation *= spotAttenuation;" +

      "  float nDotVP = max( 0.0, dot( vertNormal, VP ));" +
      "  vec3 halfVector = normalize( VP + eye );" +
      "  float nDotHV = max( 0.0, dot( vertNormal, halfVector ));" +

      "  if( nDotVP == 0.0 ) {" +
      "    powerfactor = 0.0;" +
      "  }" +
      "  else {" +
      "    powerfactor = pow( nDotHV, shininess );" +
      "  }" +

      "  spec += specular * powerfactor * attenuation;" +
      "  col += light.color * nDotVP * attenuation;" +
      "}" +

      "void main(void) {" +
      "  vec3 finalAmbient = vec3( 0.0, 0.0, 0.0 );" +
      "  vec3 finalDiffuse = vec3( 0.0, 0.0, 0.0 );" +
      "  vec3 finalSpecular = vec3( 0.0, 0.0, 0.0 );" +

      "  vec4 col = color;" +
      "  if(color[0] == -1.0){" +
      "    col = aColor;" +
      "  }" +

      "  vec3 norm = vec3( normalTransform * vec4( Normal, 0.0 ) );" +

      "  vec4 ecPos4 = view * model * vec4(Vertex,1.0);" +
      "  vec3 ecPos = (vec3(ecPos4))/ecPos4.w;" +
      "  vec3 eye = vec3( 0.0, 0.0, 1.0 );" +

      // If there were no lights this draw call, just use the
      // assigned fill color of the shape and the specular value
      "  if( lightCount == 0 ) {" +
      "    frontColor = col + vec4(mat_specular,1.0);" +
      "  }" +
      "  else {" +
      "    for( int i = 0; i < lightCount; i++ ) {" +
      "      if( lights[i].type == 0 ) {" +
      "        AmbientLight( finalAmbient, ecPos, lights[i] );" +
      "      }" +
      "      else if( lights[i].type == 1 ) {" +
      "        DirectionalLight( finalDiffuse,ecPos, finalSpecular, norm, lights[i] );" +
      "      }" +
      "      else if( lights[i].type == 2 ) {" +
      "        PointLight( finalDiffuse, finalSpecular, norm, ecPos, eye, lights[i] );" +
      "      }" +
      "      else if( lights[i].type == 3 ) {" +
      "        SpotLight( finalDiffuse, finalSpecular, norm, ecPos, eye, lights[i] );" +
      "      }" +
      "    }" +

      "   if( usingMat == false ) {" +
      "    frontColor = vec4(  " +
      "      vec3(col) * finalAmbient +" +
      "      vec3(col) * finalDiffuse +" +
      "      vec3(col) * finalSpecular," +
      "      col[3] );" +
      "   }" +
      "   else{" +
      "     frontColor = vec4( " +
      "       mat_emissive + " +
      "       (vec3(col) * mat_ambient * finalAmbient) + " +
      "       (vec3(col) * finalDiffuse) + " +
      "       (mat_specular * finalSpecular), " +
      "       col[3] );" +
      "    }" +
      "  }" +
      "  vTexture.xy = aTexture.xy;" +
      "  gl_Position = projection * view * model * vec4( Vertex, 1.0 );" +
      "}";

    var fragmentShaderSource3D =
      "#ifdef GL_ES\n" +
      "precision highp float;\n" +
      "#endif\n" +

      "varying vec4 frontColor;" +

      "uniform sampler2D sampler;" +
      "uniform bool usingTexture;" +
      "varying vec2 vTexture;" +

      // In Processing, when a texture is used, the fill color is ignored
      "void main(void){" +
      "  if(usingTexture){" +
      "    gl_FragColor =  vec4(texture2D(sampler, vTexture.xy));" +
      "  }"+
      "  else{" +
      "    gl_FragColor = frontColor;" +
      "  }" +
      "}";

    ////////////////////////////////////////////////////////////////////////////
    // 3D Functions
    ////////////////////////////////////////////////////////////////////////////

    /*
      Sets the uniform variable 'varName' to the value specified by 'value'.
      Before calling this function, make sure the correct program object
      has been installed as part of the current rendering state.

      On some systems, if the variable exists in the shader but isn't used,
      the compiler will optimize it out and this function will fail.
    */
    function uniformf(programObj, varName, varValue) {
      var varLocation = curContext.getUniformLocation(programObj, varName);
      // the variable won't be found if it was optimized out.
      if (varLocation !== -1) {
        if (varValue.length === 4) {
          curContext.uniform4fv(varLocation, varValue);
        } else if (varValue.length === 3) {
          curContext.uniform3fv(varLocation, varValue);
        } else if (varValue.length === 2) {
          curContext.uniform2fv(varLocation, varValue);
        } else {
          curContext.uniform1f(varLocation, varValue);
        }
      }
    }

    function uniformi(programObj, varName, varValue) {
      var varLocation = curContext.getUniformLocation(programObj, varName);
      // the variable won't be found if it was optimized out.
      if (varLocation !== -1) {
        if (varValue.length === 4) {
          curContext.uniform4iv(varLocation, varValue);
        } else if (varValue.length === 3) {
          curContext.uniform3iv(varLocation, varValue);
        } else if (varValue.length === 2) {
          curContext.uniform2iv(varLocation, varValue);
        } else {
          curContext.uniform1i(varLocation, varValue);
        }
      }
    }

    function vertexAttribPointer(programObj, varName, size, VBO) {
      var varLocation = curContext.getAttribLocation(programObj, varName);
      if (varLocation !== -1) {
        curContext.bindBuffer(curContext.ARRAY_BUFFER, VBO);
        curContext.vertexAttribPointer(varLocation, size, curContext.FLOAT, false, 0, 0);
        curContext.enableVertexAttribArray(varLocation);
      }
    }

    function disableVertexAttribPointer(programObj, varName){
      var varLocation = curContext.getAttribLocation(programObj, varName);
      if (varLocation !== -1) {
        curContext.disableVertexAttribArray(varLocation);
      }
    }

    function uniformMatrix(programObj, varName, transpose, matrix) {
      var varLocation = curContext.getUniformLocation(programObj, varName);
      // the variable won't be found if it was optimized out.
      if (varLocation !== -1) {
        if (matrix.length === 16) {
          curContext.uniformMatrix4fv(varLocation, transpose, matrix);
        } else if (matrix.length === 9) {
          curContext.uniformMatrix3fv(varLocation, transpose, matrix);
        } else {
          curContext.uniformMatrix2fv(varLocation, transpose, matrix);
        }
      }
    }

    var imageModeCorner = function imageModeCorner(x, y, w, h, whAreSizes) {
      return {
        x: x,
        y: y,
        w: w,
        h: h
      };
    };
    var imageModeConvert = imageModeCorner;

    var imageModeCorners = function imageModeCorners(x, y, w, h, whAreSizes) {
      return {
        x: x,
        y: y,
        w: whAreSizes ? w : w - x,
        h: whAreSizes ? h : h - y
      };
    };

    var imageModeCenter = function imageModeCenter(x, y, w, h, whAreSizes) {
      return {
        x: x - w / 2,
        y: y - h / 2,
        w: w,
        h: h
      };
    };

    var createProgramObject = function(curContext, vetexShaderSource, fragmentShaderSource) {
      var vertexShaderObject = curContext.createShader(curContext.VERTEX_SHADER);
      curContext.shaderSource(vertexShaderObject, vetexShaderSource);
      curContext.compileShader(vertexShaderObject);
      if (!curContext.getShaderParameter(vertexShaderObject, curContext.COMPILE_STATUS)) {
        throw curContext.getShaderInfoLog(vertexShaderObject);
      }

      var fragmentShaderObject = curContext.createShader(curContext.FRAGMENT_SHADER);
      curContext.shaderSource(fragmentShaderObject, fragmentShaderSource);
      curContext.compileShader(fragmentShaderObject);
      if (!curContext.getShaderParameter(fragmentShaderObject, curContext.COMPILE_STATUS)) {
        throw curContext.getShaderInfoLog(fragmentShaderObject);
      }

      var programObject = curContext.createProgram();
      curContext.attachShader(programObject, vertexShaderObject);
      curContext.attachShader(programObject, fragmentShaderObject);
      curContext.linkProgram(programObject);
      if (!curContext.getProgramParameter(programObject, curContext.LINK_STATUS)) {
        throw "Error linking shaders.";
      }

      return programObject;
    };

    ////////////////////////////////////////////////////////////////////////////
    // Char handling
    ////////////////////////////////////////////////////////////////////////////
    var charMap = {};

    var Char = p.Character = function Char(chr) {
      if (typeof chr === 'string' && chr.length === 1) {
        this.code = chr.charCodeAt(0);
      } else {
        this.code = NaN;
      }

      return (charMap[this.code] === undef) ? charMap[this.code] = this : charMap[this.code];
    };

    Char.prototype.toString = function() {
      return String.fromCharCode(this.code);
    };

    Char.prototype.valueOf = function() {
      return this.code;
    };

    ////////////////////////////////////////////////////////////////////////////
    // PShape
    ////////////////////////////////////////////////////////////////////////////
    var PShape = p.PShape = function(family) {
      this.family    = family || PConstants.GROUP;
      this.visible   = true;
      this.style     = true;
      this.children  = [];
      this.nameTable = [];
      this.params    = [];
      this.name      = "";
      this.image     = null;  //type PImage
      this.matrix    = null;
      this.kind      = null;
      this.close     = null;
      this.width     = null;
      this.height    = null;
      this.parent    = null;
      /* methods */
      this.isVisible = function(){
        return this.visible;
      };
      this.setVisible = function (visible){
        this.visible = visible;
      };
      this.disableStyle = function(){
        this.style = false;
        for(var i = 0; i < this.children.length; i++)
        {
          this.children[i].disableStyle();
        }
      };
      this.enableStyle = function(){
        this.style = true;
        for(var i = 0; i < this.children.length; i++)
        {
          this.children[i].enableStyle();
        }
      };
      this.getFamily = function(){
        return this.family;
      };
      this.getWidth = function(){
        return this.width;
      };
      this.getHeight = function(){
        return this.height;
      };
      this.setName = function(name){
        this.name = name;
      };
      this.getName = function(){
        return this.name;
      };
      this.draw = function(){
        if (this.visible) {
          this.pre();
          this.drawImpl();
          this.post();
        }
      };
      this.drawImpl = function(){
        if (this.family === PConstants.GROUP) {
          this.drawGroup();
        } else if (this.family === PConstants.PRIMITIVE) {
          this.drawPrimitive();
        } else if (this.family === PConstants.GEOMETRY) {
          this.drawGeometry();
        } else if (this.family === PConstants.PATH) {
          this.drawPath();
        }
      };
      this.drawPath = function(){
        if (this.vertices.length === 0) { return; }

        p.beginShape();
        var i;
        if (this.vertexCodes.length === 0) {  // each point is a simple vertex
          if (this.vertices[0].length === 2) {  // drawing 2D vertices
            for (i = 0; i < this.vertices.length; i++) {
              p.vertex(this.vertices[i][0], this.vertices[i][1]);
            }
          } else {  // drawing 3D vertices
            for (i = 0; i < this.vertices.length; i++) {
              p.vertex(this.vertices[i][0], this.vertices[i][1], this.vertices[i][2]);
            }
          }
        } else {  // coded set of vertices
          var index = 0;
          var j;
          if (this.vertices[0].length === 2) {  // drawing a 2D path
            for (j = 0; j < this.vertexCodes.length; j++) {
              switch (this.vertexCodes[j]) {
              case PConstants.VERTEX:
                p.vertex(this.vertices[index][0], this.vertices[index][1]);
                if ( this.vertices[index]["moveTo"] === true) {
                  vertArray[vertArray.length-1]["moveTo"] = true;
                } else if ( this.vertices[index]["moveTo"] === false) {
                  vertArray[vertArray.length-1]["moveTo"] = false;
                }
                p.breakShape = false;
                index++;
                break;
              case PConstants.BEZIER_VERTEX:
                p.bezierVertex(this.vertices[index+0][0], this.vertices[index+0][1],
                               this.vertices[index+1][0], this.vertices[index+1][1],
                               this.vertices[index+2][0], this.vertices[index+2][1]);
                index += 3;
                break;
              case PConstants.CURVE_VERTEX:
                p.curveVertex(this.vertices[index][0], this.vertices[index][1]);
                index++;
                break;
              case PConstants.BREAK:
                p.breakShape = true;
                break;
              }
            }
          } else {  // drawing a 3D path
            for (j = 0; j < this.vertexCodes.length; j++) {
              switch (this.vertexCodes[j]) {
                case PConstants.VERTEX:
                  p.vertex(this.vertices[index][0], this.vertices[index][1], this.vertices[index][2]);
                  if (this.vertices[index]["moveTo"] === true) {
                    vertArray[vertArray.length-1]["moveTo"] = true;
                  } else if (this.vertices[index]["moveTo"] === false) {
                    vertArray[vertArray.length-1]["moveTo"] = false;
                  }
                  p.breakShape = false;
                  break;
                case PConstants.BEZIER_VERTEX:
                  p.bezierVertex(this.vertices[index+0][0], this.vertices[index+0][1], this.vertices[index+0][2],
                                 this.vertices[index+1][0], this.vertices[index+1][1], this.vertices[index+1][2],
                                 this.vertices[index+2][0], this.vertices[index+2][1], this.vertices[index+2][2]);
                  index += 3;
                  break;
                case PConstants.CURVE_VERTEX:
                  p.curveVertex(this.vertices[index][0], this.vertices[index][1], this.vertices[index][2]);
                  index++;
                  break;
                case PConstants.BREAK:
                  p.breakShape = true;
                  break;
              }
            }
          }
        }
        p.endShape(this.close ? PConstants.CLOSE : PConstants.OPEN);
      };
      this.drawGeometry = function() {
        p.beginShape(this.kind);
        var i;
        if (this.style) {
          for (i = 0; i < this.vertices.length; i++) {
            p.vertex(this.vertices[i]);
          }
        } else {
          for (i = 0; i < this.vertices.length; i++) {
            var vert = this.vertices[i];
            if (vert[2] === 0) {
              p.vertex(vert[0], vert[1]);
            } else {
              p.vertex(vert[0], vert[1], vert[2]);
            }
          }
        }
        p.endShape();
      };
      this.drawGroup = function() {
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].draw();
        }
      };
      this.drawPrimitive = function() {
        switch (this.kind) {
          case PConstants.POINT:
            p.point(this.params[0], this.params[1]);
            break;
          case PConstants.LINE:
            if (this.params.length === 4) {  // 2D
              p.line(this.params[0], this.params[1],
                     this.params[2], this.params[3]);
            } else {  // 3D
              p.line(this.params[0], this.params[1], this.params[2],
                     this.params[3], this.params[4], this.params[5]);
            }
            break;
          case PConstants.TRIANGLE:
            p.triangle(this.params[0], this.params[1],
                       this.params[2], this.params[3],
                       this.params[4], this.params[5]);
            break;
          case PConstants.QUAD:
            p.quad(this.params[0], this.params[1],
                   this.params[2], this.params[3],
                   this.params[4], this.params[5],
                   this.params[6], this.params[7]);
            break;
          case PConstants.RECT:
            if (this.image !== null) {
              p.imageMode(PConstants.CORNER);
              p.image(this.image, this.params[0], this.params[1], this.params[2], this.params[3]);
            } else {
              p.rectMode(PConstants.CORNER);
              p.rect(this.params[0], this.params[1], this.params[2], this.params[3]);
            }
            break;
          case PConstants.ELLIPSE:
            p.ellipseMode(PConstants.CORNER);
            p.ellipse(this.params[0], this.params[1], this.params[2], this.params[3]);
            break;
          case PConstants.ARC:
            p.ellipseMode(PConstants.CORNER);
            p.arc(this.params[0], this.params[1], this.params[2], this.params[3], this.params[4], this.params[5]);
            break;
          case PConstants.BOX:
            if (this.params.length === 1) {
              p.box(this.params[0]);
            } else {
              p.box(this.params[0], this.params[1], this.params[2]);
            }
            break;
          case PConstants.SPHERE:
            p.sphere(this.params[0]);
            break;
        }
      };
      this.pre = function() {
        if (this.matrix) {
          p.pushMatrix();
          curContext.transform(this.matrix.elements[0], this.matrix.elements[3], this.matrix.elements[1], this.matrix.elements[4], this.matrix.elements[2], this.matrix.elements[5]);
          //p.applyMatrix(this.matrix.elements[0],this.matrix.elements[0]);
        }
        if (this.style) {
          p.pushStyle();
          this.styles();
        }
      };
      this.post = function() {
        if (this.matrix) {
          p.popMatrix();
        }
        if (this.style) {
          p.popStyle();
        }
      };
      this.styles = function() {
        if (this.stroke) {
          p.stroke(this.strokeColor);
          p.strokeWeight(this.strokeWeight);
          p.strokeCap(this.strokeCap);
          p.strokeJoin(this.strokeJoin);
        } else {
          p.noStroke();
        }

        if (this.fill) {
          p.fill(this.fillColor);

        } else {
          p.noFill();
        }
      };

      // return the PShape at the specific index from the children array or
      // return the Phape from a parent shape specified by its name
      this.getChild = function(child) {
        if (typeof child === 'number') {
          return this.children[child];
        } else {
          var found,
              i;
          if(child === "" || this.name === child){
            return this;
          } else {
            if(this.nameTable.length > 0)
            {
              for(i = 0; i < this.nameTable.length || found; i++)
              {
                if(this.nameTable[i].getName === child) {
                  found = this.nameTable[i];
                }
              }
              if (found) { return found; }
            }
            for(i = 0; i < this.children.lenth; i++)
            {
              found = this.children[i].getChild(child);
              if(found) { return found; }
            }
          }
          return null;
        }
      };
      this.getChildCount = function () {
        return this.children.length;
      };
      this.addChild = function( child ) {
        this.children.push(child);
        child.parent = this;
        if (child.getName() !== null) {
          this.addName(child.getName(), child);
        }
      };
      this.addName = function(name,  shape) {
        if (this.parent !== null) {
          this.parent.addName( name, shape );
        } else {
          this.nameTable.push( [name, shape] );
        }
      };
      this.translate = function() {
        if(arguments.length === 2)
        {
          this.checkMatrix(2);
          this.matrix.translate(arguments[0], arguments[1]);
        } else {
          this.checkMatrix(3);
          this.matrix.translate(arguments[0], arguments[1], 0);
        }
      };
      this.checkMatrix = function(dimensions) {
        if(this.matrix === null) {
          if(dimensions === 2) {
            this.matrix = new p.PMatrix2D();
          } else {
            this.matrix = new p.PMatrix3D();
          }
        }else if(dimensions === 3 && this.matrix instanceof p.PMatrix2D) {
          this.matrix = new p.PMatrix3D();
        }
      };
      this.rotateX = function(angle) {
        this.rotate(angle, 1, 0, 0);
      };
      this.rotateY = function(angle) {
        this.rotate(angle, 0, 1, 0);
      };
      this.rotateZ = function(angle) {
        this.rotate(angle, 0, 0, 1);
      };
      this.rotate = function() {
        if(arguments.length === 1){
          this.checkMatrix(2);
          this.matrix.rotate(arguments[0]);
        } else {
          this.checkMatrix(3);
          this.matrix.rotate(arguments[0], arguments[1], arguments[2] ,arguments[3]);
        }
      };
      this.scale = function() {
        if(arguments.length === 2) {
          this.checkMatrix(2);
          this.matrix.scale(arguments[0], arguments[1]);
        } else if (arguments.length === 3) {
          this.checkMatrix(2);
          this.matrix.scale(arguments[0], arguments[1], arguments[2]);
        } else {
          this.checkMatrix(2);
          this.matrix.scale(arguments[0]);
        }
      };
      this.resetMatrix = function() {
        this.checkMatrix(2);
        this.matrix.reset();
      };
      this.applyMatrix = function(matrix) {
        if (arguments.length === 1) {
          this.applyMatrix(matrix.elements[0], matrix.elements[1], 0, matrix.elements[2],
                          matrix.elements[3], matrix.elements[4], 0, matrix.elements[5],
                          0, 0, 1, 0,
                          0, 0, 0, 1);
        } else if (arguments.length === 6) {
          this.checkMatrix(2);
          this.matrix.apply(arguments[0], arguments[1], arguments[2], 0,
                            arguments[3], arguments[4], arguments[5], 0,
                            0,   0,   1,   0,
                            0,   0,   0,   1);

        } else if (arguments.length === 16) {
          this.checkMatrix(3);
          this.matrix.apply(arguments[0], arguments[1], arguments[2], arguments[3],
                            arguments[4], arguments[5], arguments[6], arguments[7],
                            arguments[8], arguments[9], arguments[10], arguments[11],
                            arguments[12], arguments[13], arguments[14], arguments[15]);
        }
      };
      // findChild not in yet
      // apply missing
      // contains missing
      // find child missing
      // getPrimitive missing
      // getParams missing
      // getVertex , getVertexCount missing
      // getVertexCode , getVertexCodes , getVertexCodeCount missing
      // getVertexX, getVertexY, getVertexZ missing

    };

    var PShapeSVG = function() {
      p.PShape.call( this ); // PShape is the base class.
      if (arguments.length === 1) {
        this.element  = new p.XMLElement(null, arguments[0]);
        // set values to their defaults according to the SVG spec
        this.vertexCodes         = [];
        this.vertices            = [];
        this.opacity             = 1;

        this.stroke              = false;
        this.strokeColor         = PConstants.ALPHA_MASK;
        this.strokeWeight        = 1;
        this.strokeCap           = PConstants.SQUARE;  // equivalent to BUTT in svg spec
        this.strokeJoin          = PConstants.MITER;
        this.strokeGradient      = null;
        this.strokeGradientPaint = null;
        this.strokeName          = null;
        this.strokeOpacity       = 1;

        this.fill                = true;
        this.fillColor           = PConstants.ALPHA_MASK;
        this.fillGradient        = null;
        this.fillGradientPaint   = null;
        this.fillName            = null;
        this.fillOpacity         = 1;

        if (this.element.getName() !== "svg") {
          throw("root is not <svg>, it's <" + this.element.getName() + ">");
        }
      }
      else if (arguments.length === 2) {
        if (typeof arguments[1] === 'string') {
          if (arguments[1].indexOf(".svg") > -1) { //its a filename
            this.element = new p.XMLElement(null, arguments[1]);
            // set values to their defaults according to the SVG spec
            this.vertexCodes         = [];
            this.vertices            = [];
            this.opacity             = 1;

            this.stroke              = false;
            this.strokeColor         = PConstants.ALPHA_MASK;
            this.strokeWeight        = 1;
            this.strokeCap           = PConstants.SQUARE;  // equivalent to BUTT in svg spec
            this.strokeJoin          = PConstants.MITER;
            this.strokeGradient      = "";
            this.strokeGradientPaint = "";
            this.strokeName          = "";
            this.strokeOpacity       = 1;

            this.fill                = true;
            this.fillColor           = PConstants.ALPHA_MASK;
            this.fillGradient        = null;
            this.fillGradientPaint   = null;
            this.fillOpacity         = 1;

          }
        } else { // XMLElement
          if (arguments[0]) { // PShapeSVG
            this.element             = arguments[1];
            this.vertexCodes         = arguments[0].vertexCodes.slice();
            this.vertices            = arguments[0].vertices.slice();

            this.stroke              = arguments[0].stroke;
            this.strokeColor         = arguments[0].strokeColor;
            this.strokeWeight        = arguments[0].strokeWeight;
            this.strokeCap           = arguments[0].strokeCap;
            this.strokeJoin          = arguments[0].strokeJoin;
            this.strokeGradient      = arguments[0].strokeGradient;
            this.strokeGradientPaint = arguments[0].strokeGradientPaint;
            this.strokeName          = arguments[0].strokeName;

            this.fill                = arguments[0].fill;
            this.fillColor           = arguments[0].fillColor;
            this.fillGradient        = arguments[0].fillGradient;
            this.fillGradientPaint   = arguments[0].fillGradientPaint;
            this.fillName            = arguments[0].fillName;
            this.strokeOpacity       = arguments[0].strokeOpacity;
            this.fillOpacity         = arguments[0].fillOpacity;
            this.opacity             = arguments[0].opacity;
          }
        }
      }

      this.name      = this.element.getStringAttribute("id");
      var displayStr = this.element.getStringAttribute("display", "inline");
      this.visible   = displayStr !== "none";
      var str = this.element.getAttribute("transform");
      if (str) {
        this.matrix = this.parseMatrix(str);
      }
      // not proper parsing of the viewBox, but will cover us for cases where
      // the width and height of the object is not specified
      var viewBoxStr = this.element.getStringAttribute("viewBox");
      if ( viewBoxStr !== null ) {
        var viewBox = viewBoxStr.split(" ");
        this.width  = viewBox[2];
        this.height = viewBox[3];
      }

      // TODO if viewbox is not same as width/height, then use it to scale
      // the original objects. for now, viewbox only used when width/height
      // are empty values (which by the spec means w/h of "100%"
      var unitWidth  = this.element.getStringAttribute("width");
      var unitHeight = this.element.getStringAttribute("height");
      if (unitWidth !== null) {
        this.width  = this.parseUnitSize(unitWidth);
        this.height = this.parseUnitSize(unitHeight);
      } else {
        if ((this.width === 0) || (this.height === 0)) {
          // For the spec, the default is 100% and 100%. For purposes
          // here, insert a dummy value because this is prolly just a
          // font or something for which the w/h doesn't matter.
          this.width  = 1;
          this.height = 1;

          //show warning
          throw("The width and/or height is not " +
                                "readable in the <svg> tag of this file.");
        }
      }
      this.parseColors(this.element);
      this.parseChildren(this.element);

    };

    PShapeSVG.prototype = {
      // getChild missing
      // print missing
      // parse style attributes
      // styles missing but deals with strokeGradient and fillGradient
      parseMatrix: function(str) {
        this.checkMatrix(2);
        var pieces = [];
        str.replace(/\s*(\w+)\((.*?)\)/g, function(all) {
          // get a list of transform definitions
          pieces.push(p.trim(all));
        });
        if (pieces.length === 0) {
          p.println("Transformation:" + str + " is empty");
          return null;
        }
        for (var i =0; i< pieces.length; i++) {
          var m = [];
          pieces[i].replace(/\((.*?)\)/, (function() {
            return function(all, params) {
              // get the coordinates that can be separated by spaces or a comma
              m = params.replace(/,+/g, " ").split(/\s+/);
            };
          }()));

          if (pieces[i].indexOf("matrix") !== -1) {
            this.matrix.set(m[0], m[2], m[4], m[1], m[3], m[5]);
          } else if (pieces[i].indexOf("translate") !== -1) {
            var tx = m[0];
            var ty = (m.length === 2) ? m[1] : 0;
            this.matrix.translate(tx,ty);
          } else if (pieces[i].indexOf("scale") !== -1) {
            var sx = m[0];
            var sy = (m.length === 2) ? m[1] : m[0];
            this.matrix.scale(sx,sy);
          } else if (pieces[i].indexOf("rotate") !== -1) {
            var angle = m[0];
            if (m.length === 1) {
              this.matrix.rotate(p.radians(angle));
            } else if (m.length === 3) {
              this.matrix.translate(m[1], m[2]);
              this.matrix.rotate(p.radians(m[0]));
              this.matrix.translate(-m[1], -m[2]);
            }
          } else if (pieces[i].indexOf("skewX") !== -1) {
            this.matrix.skewX(parseFloat(m[0]));
          } else if (pieces[i].indexOf("skewY") !== -1) {
            this.matrix.skewY(m[0]);
          }
        }
        return this.matrix;
      },
      parseChildren:function(element) {
        var newelement = element.getChildren();
        var children   = new p.PShape();
        for (var i = 0; i < newelement.length; i++) {
          var kid = this.parseChild(newelement[i]);
          if (kid) {
            children.addChild(kid);
          }
        }
        this.children.push(children);
      },
      getName: function() {
        return this.name;
      },
      parseChild: function( elem ) {
        var name = elem.getName();
        var shape;
        switch (name) {
          case "g":
            shape = new PShapeSVG(this, elem);
            break;
          case "defs":
            // generally this will contain gradient info, so may
            // as well just throw it into a group element for parsing
            shape = new PShapeSVG(this, elem);
            break;
          case "line":
            shape = new PShapeSVG(this, elem);
            shape.parseLine();
            break;
          case "circle":
            shape = new PShapeSVG(this, elem);
            shape.parseEllipse(true);
            break;
          case "ellipse":
            shape = new PShapeSVG(this, elem);
            shape.parseEllipse(false);
            break;
          case "rect":
            shape = new PShapeSVG(this, elem);
            shape.parseRect();
            break;
          case "polygon":
            shape = new PShapeSVG(this, elem);
            shape.parsePoly(true);
            break;
          case "polyline":
            shape = new PShapeSVG(this, elem);
            shape.parsePoly(false);
            break;
          case "path":
            shape = new PShapeSVG(this, elem);
            shape.parsePath();
            break;
          case "radialGradient":
            //return new RadialGradient(this, elem);
            break;
          case "linearGradient":
            //return new LinearGradient(this, elem);
            break;
          case "text":
            p.println("Text in SVG files is not currently supported, convert text to outlines instead." );
            break;
          case "filter":
            p.println("Filters are not supported.");
            break;
          case "mask":
            p.println("Masks are not supported.");
            break;
          default:
            p.println("Ignoring  <" + name + "> tag.");
            break;
        }
        return shape;
      },
      parsePath: function() {
        this.family = PConstants.PATH;
        this.kind = 0;
        var pathDataChars = [];
        var c;
        var pathData = p.trim(this.element.getStringAttribute("d").replace(/[\s,]+/g,' ')); //change multiple spaces and commas to single space
        if (pathData === null) { return; }
        pathData = pathData.toCharArray();
        var cx     = 0,
            cy     = 0,
            ctrlX  = 0,
            ctrlY  = 0,
            ctrlX1 = 0,
            ctrlX2 = 0,
            ctrlY1 = 0,
            ctrlY2 = 0,
            endX   = 0,
            endY   = 0,
            ppx    = 0,
            ppy    = 0,
            px     = 0,
            py     = 0,
            i      = 0,
            j      = 0,
            valOf  = 0;
        var str = "";
        var tmpArray =[];
        var flag = false;
        var lastInstruction;
        var command;
        while (i< pathData.length) {
          valOf = pathData[i].valueOf();
          if ((valOf >= 65 && valOf <= 90) || (valOf >= 97 && valOf <= 122)) { // if its a letter
            // populate the tmpArray with coordinates
            j = i;
            i++;
            if (i < pathData.length) { // dont go over boundary of array
              tmpArray = [];
              valOf = pathData[i].valueOf();
              while (!((valOf >= 65 && valOf <= 90) || (valOf >= 97 && valOf <= 100) || (valOf >= 102 && valOf <= 122)) && flag === false) { // if its NOT a letter
                if (valOf === 32) { //if its a space and the str isn't empty
                  // somethimes you get a space after the letter
                  if (str !== "") {
                    tmpArray.push(parseFloat(str));
                    str = "";
                  }
                  i++;
                } else if (valOf === 45) { //if its a -
                  // allow for 'e' notation in numbers, e.g. 2.10e-9
                  if (pathData[i-1].valueOf() === 101) {
                    str += pathData[i].toString();
                    i++;
                  } else {
                    // sometimes no space separator after (ex: 104.535-16.322)
                    if (str !== "") {
                      tmpArray.push(parseFloat(str));
                    }
                    str = pathData[i].toString();
                    i++;
                  }
                } else {
                  str += pathData[i].toString();
                  i++;
                }
                if (i === pathData.length) { // dont go over boundary of array
                  flag = true;
                } else {
                  valOf = pathData[i].valueOf();
                }
              }
            }
            if (str !== "") {
              tmpArray.push(parseFloat(str));
              str = "";
            }
            command = pathData[j];
            switch (command.valueOf()) {
              case 77:  // M - move to (absolute)
                if (tmpArray.length >= 2 && tmpArray.length % 2 ===0) { // need one+ pairs of co-ordinates
                  cx = tmpArray[0];
                  cy = tmpArray[1];
                  this.parsePathMoveto(cx, cy);
                  if (tmpArray.length > 2) {
                    for (j = 2; j < tmpArray.length; j+=2) {
                      // absolute line to
                      cx = tmpArray[j];
                      cy = tmpArray[j+1];
                      this.parsePathLineto(cx,cy);
                    }
                  }
                }
                break;
              case 109:  // m - move to (relative)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  this.parsePathMoveto(cx,cy);
                  if (tmpArray.length > 2) {
                    for (j = 2; j < tmpArray.length; j+=2) {
                      // relative line to
                      cx += tmpArray[j];
                      cy += tmpArray[j + 1];
                      this.parsePathLineto(cx,cy);
                    }
                  }
                }
                break;
              case 76: // L - lineto (absolute)
              if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                for (j = 0; j < tmpArray.length; j+=2) {
                  cx = tmpArray[j];
                  cy = tmpArray[j + 1];
                  this.parsePathLineto(cx,cy);
                }
              }
              break;

              case 108: // l - lineto (relative)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  for (j = 0; j < tmpArray.length; j+=2) {
                    cx += tmpArray[j];
                    cy += tmpArray[j+1];
                    this.parsePathLineto(cx,cy);
                  }
                }
                break;

              case 72: // H - horizontal lineto (absolute)
                for (j = 0; j < tmpArray.length; j++) { // multiple x co-ordinates can be provided
                  cx = tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 104: // h - horizontal lineto (relative)
                for (j = 0; j < tmpArray.length; j++) { // multiple x co-ordinates can be provided
                  cx += tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 86: // V - vertical lineto (absolute)
                for (j = 0; j < tmpArray.length; j++) { // multiple y co-ordinates can be provided
                  cy = tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 118: // v - vertical lineto (relative)
                for (j = 0; j < tmpArray.length; j++) { // multiple y co-ordinates can be provided
                  cy += tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 67: // C - curve to (absolute)
                if (tmpArray.length >= 6 && tmpArray.length % 6 === 0) { // need one+ multiples of 6 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=6) {
                    ctrlX1 = tmpArray[j];
                    ctrlY1 = tmpArray[j + 1];
                    ctrlX2 = tmpArray[j + 2];
                    ctrlY2 = tmpArray[j + 3];
                    endX   = tmpArray[j + 4];
                    endY   = tmpArray[j + 5];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 99: // c - curve to (relative)
                if (tmpArray.length >= 6 && tmpArray.length % 6 === 0) { // need one+ multiples of 6 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=6) {
                    ctrlX1 = cx + tmpArray[j];
                    ctrlY1 = cy + tmpArray[j + 1];
                    ctrlX2 = cx + tmpArray[j + 2];
                    ctrlY2 = cy + tmpArray[j + 3];
                    endX   = cx + tmpArray[j + 4];
                    endY   = cy + tmpArray[j + 5];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 83: // S - curve to shorthand (absolute)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    if (lastInstruction.toLowerCase() ===  "c" || lastInstruction.toLowerCase() ===  "s") {
                      ppx    = this.vertices[ this.vertices.length-2 ][0];
                      ppy    = this.vertices[ this.vertices.length-2 ][1];
                      px     = this.vertices[ this.vertices.length-1 ][0];
                      py     = this.vertices[ this.vertices.length-1 ][1];
                      ctrlX1 = px + (px - ppx);
                      ctrlY1 = py + (py - ppy);
                    } else {
                      //If there is no previous curve, the current point will be used as the first control point.
                      ctrlX1 = this.vertices[this.vertices.length-1][0];
                      ctrlY1 = this.vertices[this.vertices.length-1][1];
                    }
                    ctrlX2 = tmpArray[j];
                    ctrlY2 = tmpArray[j + 1];
                    endX   = tmpArray[j + 2];
                    endY   = tmpArray[j + 3];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 115: // s - curve to shorthand (relative)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    if (lastInstruction.toLowerCase() ===  "c" || lastInstruction.toLowerCase() ===  "s") {
                      ppx    = this.vertices[this.vertices.length-2][0];
                      ppy    = this.vertices[this.vertices.length-2][1];
                      px     = this.vertices[this.vertices.length-1][0];
                      py     = this.vertices[this.vertices.length-1][1];
                      ctrlX1 = px + (px - ppx);
                      ctrlY1 = py + (py - ppy);
                    } else {
                      //If there is no previous curve, the current point will be used as the first control point.
                      ctrlX1 = this.vertices[this.vertices.length-1][0];
                      ctrlY1 = this.vertices[this.vertices.length-1][1];
                    }
                    ctrlX2 = cx + tmpArray[j];
                    ctrlY2 = cy + tmpArray[j + 1];
                    endX   = cx + tmpArray[j + 2];
                    endY   = cy + tmpArray[j + 3];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 81: // Q - quadratic curve to (absolute)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    ctrlX = tmpArray[j];
                    ctrlY = tmpArray[j + 1];
                    endX  = tmpArray[j + 2];
                    endY  = tmpArray[j + 3];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 113: // q - quadratic curve to (relative)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    ctrlX = cx + tmpArray[j];
                    ctrlY = cy + tmpArray[j + 1];
                    endX  = cx + tmpArray[j + 2];
                    endY  = cy + tmpArray[j + 3];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 84: // T - quadratic curve to shorthand (absolute)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  for (j = 0; j < tmpArray.length; j+=2) {
                    if (lastInstruction.toLowerCase() ===  "q" || lastInstruction.toLowerCase() ===  "t") {
                      ppx   = this.vertices[this.vertices.length-2][0];
                      ppy   = this.vertices[this.vertices.length-2][1];
                      px    = this.vertices[this.vertices.length-1][0];
                      py    = this.vertices[this.vertices.length-1][1];
                      ctrlX = px + (px - ppx);
                      ctrlY = py + (py - ppy);
                    } else {
                      // If there is no previous command or if the previous command was not a Q, q, T or t,
                      // assume the control point is coincident with the current point.
                      ctrlX = cx;
                      ctrlY = cy;
                    }
                    endX  = tmpArray[j];
                    endY  = tmpArray[j + 1];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 116:  // t - quadratic curve to shorthand (relative)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  for (j = 0; j < tmpArray.length; j+=2) {
                    if (lastInstruction.toLowerCase() ===  "q" || lastInstruction.toLowerCase() ===  "t") {
                      ppx   = this.vertices[this.vertices.length-2][0];
                      ppy   = this.vertices[this.vertices.length-2][1];
                      px    = this.vertices[this.vertices.length-1][0];
                      py    = this.vertices[this.vertices.length-1][1];
                      ctrlX = px + (px - ppx);
                      ctrlY = py + (py - ppy);
                    } else {
                      // If there is no previous command or if the previous command was not a Q, q, T or t,
                      // assume the control point is coincident with the current point.
                      ctrlX = cx;
                      ctrlY = cy;
                    }
                    endX  = cx + tmpArray[j];
                    endY  = cy + tmpArray[j + 1];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 90: //Z
              case 122: //z
                this.close = true;
                break;
            }
            lastInstruction = command.toString();
          } else { i++;}
        }
      },
      parsePathQuadto: function(x1, y1, cx, cy, x2, y2) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.BEZIER_VERTEX);
          // x1/y1 already covered by last moveto, lineto, or curveto
          this.parsePathVertex(x1 + ((cx-x1)*2/3), y1 + ((cy-y1)*2/3));
          this.parsePathVertex(x2 + ((cx-x2)*2/3), y2 + ((cy-y2)*2/3));
          this.parsePathVertex(x2, y2);
        } else {
          throw ("Path must start with M/m");
        }
      },
      parsePathCurveto : function(x1,  y1, x2, y2, x3, y3) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.BEZIER_VERTEX );
          this.parsePathVertex(x1, y1);
          this.parsePathVertex(x2, y2);
          this.parsePathVertex(x3, y3);
        } else {
          throw ("Path must start with M/m");
        }
      },
      parsePathLineto: function(px, py) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.VERTEX);
          this.parsePathVertex(px, py);
          // add property to distinguish between curContext.moveTo or curContext.lineTo
          this.vertices[this.vertices.length-1]["moveTo"] = false;
        } else {
          throw ("Path must start with M/m");
        }
      },
      parsePathMoveto: function(px, py) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.BREAK);
        }
        this.parsePathCode(PConstants.VERTEX);
        this.parsePathVertex(px, py);
        // add property to distinguish between curContext.moveTo or curContext.lineTo
        this.vertices[this.vertices.length-1]["moveTo"] = true;
      },
      parsePathVertex: function(x,  y) {
        var verts = [];
        verts[0]  = x;
        verts[1]  = y;
        this.vertices.push(verts);
      },
      parsePathCode: function(what) {
        this.vertexCodes.push(what);
      },
      parsePoly: function(val) {
        this.family    = PConstants.PATH;
        this.close     = val;
        var pointsAttr = p.trim(this.element.getStringAttribute("points").replace(/[,\s]+/g,' '));
        if (pointsAttr !== null) {
          //split into array
          var pointsBuffer = pointsAttr.split(" ");
          if (pointsBuffer.length % 2 === 0) {
            for (var i = 0; i < pointsBuffer.length; i++) {
              var verts = [];
              verts[0]  = pointsBuffer[i];
              verts[1]  = pointsBuffer[++i];
              this.vertices.push(verts);
            }
          } else {
            p.println("Error parsing polygon points: odd number of coordinates provided");
          }
        }
      },
      parseRect: function() {
        this.kind      = PConstants.RECT;
        this.family    = PConstants.PRIMITIVE;
        this.params    = [];
        this.params[0] = this.element.getFloatAttribute("x");
        this.params[1] = this.element.getFloatAttribute("y");
        this.params[2] = this.element.getFloatAttribute("width");
        this.params[3] = this.element.getFloatAttribute("height");

      },
      parseEllipse: function(val) {
        this.kind   = PConstants.ELLIPSE;
        this.family = PConstants.PRIMITIVE;
        this.params = [];

        this.params[0] = this.element.getFloatAttribute("cx");
        this.params[1] = this.element.getFloatAttribute("cy");

        var rx, ry;
        if (val) {
          rx = ry = this.element.getFloatAttribute("r");
        } else {
          rx = this.element.getFloatAttribute("rx");
          ry = this.element.getFloatAttribute("ry");
        }
        this.params[0] -= rx;
        this.params[1] -= ry;

        this.params[2] = rx*2;
        this.params[3] = ry*2;
      },
      parseLine: function() {
        this.kind = PConstants.LINE;
        this.family = PConstants.PRIMITIVE;
        this.params = [];
        this.params[0] = this.element.getFloatAttribute("x1");
        this.params[1] = this.element.getFloatAttribute("y1");
        this.params[2] = this.element.getFloatAttribute("x2");
        this.params[3] = this.element.getFloatAttribute("y2");
      },
      parseColors: function(element) {
        if (element.hasAttribute("opacity")) {
          this.setOpacity(element.getAttribute("opacity"));
        }
        if (element.hasAttribute("stroke")) {
          this.setStroke(element.getAttribute("stroke"));
        }
        if (element.hasAttribute("stroke-width")) {
          // if NaN (i.e. if it's 'inherit') then default back to the inherit setting
          this.setStrokeWeight(element.getAttribute("stroke-width"));
        }
        if (element.hasAttribute("stroke-linejoin") ) {
          this.setStrokeJoin(element.getAttribute("stroke-linejoin"));
        }
        if (element.hasAttribute("stroke-linecap")) {
          this.setStrokeCap(element.getStringAttribute("stroke-linecap"));
        }
        // fill defaults to black (though stroke defaults to "none")
        // http://www.w3.org/TR/SVG/painting.html#FillProperties
        if (element.hasAttribute("fill")) {
          this.setFill(element.getStringAttribute("fill"));
        }
        if (element.hasAttribute("style")) {
          var styleText   = element.getStringAttribute("style");
          var styleTokens = styleText.toString().split( ";" );

          for (var i = 0; i < styleTokens.length; i++) {
            var tokens = p.trim(styleTokens[i].split( ":" ));
            switch(tokens[0]){
              case "fill":
                this.setFill(tokens[1]);
                break;
              case "fill-opacity":

                this.setFillOpacity(tokens[1]);

                break;
              case "stroke":
                this.setStroke(tokens[1]);
                break;
              case "stroke-width":
                this.setStrokeWeight(tokens[1]);
                break;
              case "stroke-linecap":
                this.setStrokeCap(tokens[1]);
                break;
              case "stroke-linejoin":
                this.setStrokeJoin(tokens[1]);
                break;
              case "stroke-opacity":
                this.setStrokeOpacity(tokens[1]);
                break;
              case "opacity":
                this.setOpacity(tokens[1]);
                break;
              // Other attributes are not yet implemented
            }
          }
        }
      },
      setFillOpacity: function(opacityText) {
        this.fillOpacity = parseFloat(opacityText);
        this.fillColor   = this.fillOpacity * 255  << 24 | this.fillColor & 0xFFFFFF;
      },
      setFill: function (fillText) {
        var opacityMask = this.fillColor & 0xFF000000;
        if (fillText === "none") {
          this.fill = false;
        } else if (fillText.indexOf("#") === 0) {
          this.fill      = true;
          this.fillColor = opacityMask | (parseInt(fillText.substring(1), 16 )) & 0xFFFFFF;
        } else if (fillText.indexOf("rgb") === 0) {
          this.fill      = true;
          this.fillColor = opacityMask | this.parseRGB(fillText);
        } else if (fillText.indexOf("url(#") === 0) {
          this.fillName = fillText.substring(5, fillText.length - 1 );
          /*Object fillObject = findChild(fillName);
          if (fillObject instanceof Gradient) {
            fill = true;
            fillGradient = (Gradient) fillObject;
            fillGradientPaint = calcGradientPaint(fillGradient); //, opacity);
          } else {
            System.err.println("url " + fillName + " refers to unexpected data");
          }*/
        } else {
          if (colors[fillText]) {
            this.fill      = true;
            this.fillColor = opacityMask | (parseInt(colors[fillText].substring(1), 16)) & 0xFFFFFF;
          }
        }
      },
      setOpacity: function(opacity) {
        this.strokeColor = parseFloat(opacity) * 255 << 24 | this.strokeColor & 0xFFFFFF;
        this.fillColor   = parseFloat(opacity) * 255 << 24 | this.fillColor & 0xFFFFFF;
      },
      setStroke: function(strokeText) {
        var opacityMask = this.strokeColor & 0xFF000000;
        if (strokeText === "none") {
          this.stroke = false;
        } else if (strokeText.charAt( 0 ) === "#") {
          this.stroke      = true;
          this.strokeColor = opacityMask | (parseInt( strokeText.substring( 1 ), 16 )) & 0xFFFFFF;
        } else if (strokeText.indexOf( "rgb" ) === 0 ) {
          this.stroke = true;
          this.strokeColor = opacityMask | this.parseRGB(strokeText);
        } else if (strokeText.indexOf( "url(#" ) === 0) {
          this.strokeName = strokeText.substring(5, strokeText.length - 1);
            //this.strokeObject = findChild(strokeName);
          /*if (strokeObject instanceof Gradient) {
            strokeGradient = (Gradient) strokeObject;
            strokeGradientPaint = calcGradientPaint(strokeGradient); //, opacity);
          } else {
            System.err.println("url " + strokeName + " refers to unexpected data");
          }*/
        } else {
          if (colors[strokeText]){
            this.stroke      = true;
            this.strokeColor = opacityMask | (parseInt(colors[strokeText].substring(1), 16)) & 0xFFFFFF;
          }
        }
      },
      setStrokeWeight: function(weight) {
        this.strokeWeight = this.parseUnitSize(weight);
      },
      setStrokeJoin: function(linejoin) {
        if (linejoin === "miter") {
          this.strokeJoin = PConstants.MITER;

        } else if (linejoin === "round") {
          this.strokeJoin = PConstants.ROUND;

        } else if (linejoin === "bevel") {
          this.strokeJoin = PConstants.BEVEL;
        }
      },
      setStrokeCap: function (linecap) {
        if (linecap === "butt") {
          this.strokeCap = PConstants.SQUARE;

        } else if (linecap === "round") {
          this.strokeCap = PConstants.ROUND;

        } else if (linecap === "square") {
          this.strokeCap = PConstants.PROJECT;
        }
      },
      setStrokeOpacity: function (opacityText) {
        this.strokeOpacity = parseFloat(opacityText);
        this.strokeColor   = this.strokeOpacity * 255 << 24 | this.strokeColor & 0xFFFFFF;
      },
      parseRGB: function(color) {
        var sub    = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
        var values = sub.split(", ");
        return (values[0] << 16) | (values[1] << 8) | (values[2]);
      },
      parseUnitSize: function (text) {
        var len = text.length - 2;
        if (len < 0) { return text; }
        if (text.indexOf("pt") === len) {
          return parseFloat(text.substring(0, len)) * 1.25;
        } else if (text.indexOf("pc") === len) {
          return parseFloat( text.substring( 0, len)) * 15;
        } else if (text.indexOf("mm") === len) {
          return parseFloat( text.substring(0, len)) * 3.543307;
        } else if (text.indexOf("cm") === len) {
          return parseFloat(text.substring(0, len)) * 35.43307;
        } else if (text.indexOf("in") === len) {
          return parseFloat(text.substring(0, len)) * 90;
        } else if (text.indexOf("px") === len) {
          return parseFloat(text.substring(0, len));
        } else {
          return parseFloat(text);
        }
      }
    };

    p.shape = function(shape, x, y, width, height) {
      if (arguments.length >= 1 && arguments[0] !== null) {
        if (shape.isVisible()) {
          p.pushMatrix();
          if (curShapeMode === PConstants.CENTER) {
            if (arguments.length === 5) {
              p.translate(x - width/2, y - height/2);
              p.scale(width / shape.getWidth(), height / shape.getHeight());
            } else if (arguments.length === 3) {
              p.translate(x - shape.getWidth()/2, - shape.getHeight()/2);
            } else {
              p.translate(-shape.getWidth()/2, -shape.getHeight()/2);
            }
          } else if (curShapeMode === PConstants.CORNER) {
            if (arguments.length === 5) {
              p.translate(x, y);
              p.scale(width / shape.getWidth(), height / shape.getHeight());
            } else if (arguments.length === 3) {
              p.translate(x, y);
            }
          } else if (curShapeMode === PConstants.CORNERS) {
            if (arguments.length === 5) {
              width  -= x;
              height -= y;
              p.translate(x, y);
              p.scale(width / shape.getWidth(), height / shape.getHeight());
            } else if (arguments.length === 3) {
              p.translate(x, y);
            }
          }
          shape.draw();
          if ((arguments.length === 1 && curShapeMode === PConstants.CENTER ) || arguments.length > 1) {
            p.popMatrix();
          }
        }
      }
    };

    p.shapeMode = function (mode) {
      curShapeMode = mode;
    };

    p.loadShape = function (filename) {
      if (arguments.length === 1) {
        if (filename.indexOf(".svg") > -1) {
          return new PShapeSVG(null, filename);
        }
      }
      return null;
    };


    ////////////////////////////////////////////////////////////////////////////
    // XMLAttribute
    ////////////////////////////////////////////////////////////////////////////
    var XMLAttribute = function(fname, n, nameSpace, v, t){
      this.fullName = fname || "";
      this.name = n || "";
      this.namespace = nameSpace || "";
      this.value = v;
      this.type = t;
    };
    XMLAttribute.prototype = {
      getName: function() {
        return this.name;
      },
      getFullName: function() {
        return this.fullName;
      },
      getNamespace: function() {
        return this.namespace;
      },
      getValue: function() {
        return this.value;
      },
      getType: function() {
        return this.type;
      },
      setValue: function(newval) {
        this.value = newval;
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // XMLElement
    ////////////////////////////////////////////////////////////////////////////
    var XMLElement = p.XMLElement = function() {
      if (arguments.length === 4) {
        this.attributes = [];
        this.children   = [];
        this.fullName   = arguments[0] || "";
        if (arguments[1]) {
            this.name = arguments[1];
        } else {
            var index = this.fullName.indexOf(':');
            if (index >= 0) {
                this.name = this.fullName.substring(index + 1);
            } else {
                this.name = this.fullName;
            }
        }
        this.namespace = arguments[1];
        this.content   = "";
        this.lineNr    = arguments[3];
        this.systemID  = arguments[2];
        this.parent    = null;
      }
      else if ((arguments.length === 2 && arguments[1].indexOf(".") > -1) ) { // filename or svg xml element
        this.attributes = [];
        this.children   = [];
        this.fullName   = "";
        this.name       = "";
        this.namespace  = "";
        this.content    = "";
        this.systemID   = "";
        this.lineNr     = "";
        this.parent     = null;
        this.parse(arguments[arguments.length -1]);
      } else if (arguments.length === 1 && typeof arguments[0] === "string"){
        //xml string
        this.attributes = [];
        this.children   = [];
        this.fullName   = "";
        this.name       = "";
        this.namespace  = "";
        this.content    = "";
        this.systemID   = "";
        this.lineNr     = "";
        this.parent     = null;
        this.parse(arguments[0]);
      }
      else { //empty ctor
        this.attributes = [];
        this.children   = [];
        this.fullName   = "";
        this.name       = "";
        this.namespace  = "";
        this.content    = "";
        this.systemID   = "";
        this.lineNr     = "";
        this.parent     = null;

      }
      return this;
    };
    /*XMLElement methods
      missing: enumerateAttributeNames(), enumerateChildren(),
      NOTE: parse does not work when a url is passed in
    */
    XMLElement.prototype = {
      parse: function(filename) {
        var xmlDoc;
        try {
          if (filename.indexOf(".xml") > -1 || filename.indexOf(".svg") > -1) {
            filename = ajax(filename);
          }
          xmlDoc = new DOMParser().parseFromString(filename, "text/xml");
          var elements = xmlDoc.documentElement;
          if (elements) {
            this.parseChildrenRecursive(null, elements);
          } else {
            throw ("Error loading document");
          }
          return this;
        } catch(e) {
          throw(e);
        }
      },
      createElement: function () {
        if (arguments.length === 2) {
          return new XMLElement(arguments[0], arguments[1], null, null);
        } else {
          return new XMLElement(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
      },
      hasAttribute: function (name) {
        return this.getAttribute(name) !== null;
        //2 parameter call missing
      },
      createPCDataElement: function () {
        return new XMLElement();
      },
      equals: function(object){
        if (typeof object === "Object") {
          return this.equalsXMLElement(object);
        }
      },
      equalsXMLElement: function (object) {
        if (object instanceof XMLElement) {
          if (this.name !== object.getLocalName) { return false; }
          if (this.attributes.length !== object.getAttributeCount()) { return false; }
          for (var i = 0; i < this.attributes.length; i++){
            if (! object.hasAttribute(this.attributes[i].getName(), this.attributes[i].getNamespace())) { return false; }
            if (this.attributes[i].getValue() !== object.attributes[i].getValue()) { return false; }
            if (this.attributes[i].getType()  !== object.attributes[i].getType()) { return false; }
          }
          if (this.children.length !== object.getChildCount()) { return false; }
          var child1, child2;
          for (i = 0; i < this.children.length; i++) {
            child1 = this.getChildAtIndex(i);
            child2 = object.getChildAtIndex(i);
            if (! child1.equalsXMLElement(child2)) { return false; }
          }
          return true;
        }
      },
      getContent: function(){
         return this.content;
      },
      getAttribute: function (){
        var attribute;
        if( arguments.length === 2 ){
          attribute = this.findAttribute(arguments[0]);
          if (attribute) {
            return attribute.getValue();
          } else {
            return arguments[1];
          }
        } else if (arguments.length === 1) {
          attribute = this.findAttribute(arguments[0]);
          if (attribute) {
            return attribute.getValue();
          } else {
            return null;
          }
        }
      },
      getStringAttribute: function() {
        if (arguments.length === 1) {
          return this.getAttribute(arguments[0]);
        } else if (arguments.length === 2){
          return this.getAttribute(arguments[0], arguments[1]);
        } else {
          return this.getAttribute(arguments[0], arguments[1],arguments[2]);
        }
      },
      getFloatAttribute: function() {
        if (arguments.length === 1 ) {
          return parseFloat(this.getAttribute(arguments[0], 0));
        } else if (arguments.length === 2 ){
          return this.getAttribute(arguments[0], arguments[1]);
        } else {
          return this.getAttribute(arguments[0], arguments[1],arguments[2]);
        }
      },
      getIntAttribute: function () {
        if (arguments.length === 1) {
          return this.getAttribute( arguments[0], 0 );
        } else if (arguments.length === 2) {
          return this.getAttribute(arguments[0], arguments[1]);
        } else {
          return this.getAttribute(arguments[0], arguments[1],arguments[2]);
        }
      },
      hasChildren: function () {
        return this.children.length > 0 ;
      },
      addChild: function (child) {
        if (child !== null) {
          child.parent = this;
          this.children.push(child);
        }
      },
      insertChild: function (child, index) {
        if (child) {
          if ((child.getLocalName() === null) && (! this.hasChildren())) {
            var lastChild = this.children[this.children.length -1];
            if (lastChild.getLocalName() === null) {
                lastChild.setContent(lastChild.getContent() + child.getContent());
                return;
            }
          }
          child.parent = this;
          this.children.splice(index,0,child);
        }
      },
      getChild: function (index){
        if (typeof index  === "number") {
          return this.children[index];
        }
        else if (index.indexOf('/') !== -1) { // path was given
          this.getChildRecursive(index.split("/"), 0);
        } else {
          var kid, kidName;
          for (var i = 0; i < this.getChildCount(); i++) {
            kid = this.getChild(i);
            kidName = kid.getName();
            if (kidName !== null && kidName === index) {
                return kid;
            }
          }
          return null;
        }
      },
      getChildren: function(){
        if (arguments.length === 1) {
          if (typeof arguments[0]  === "number") {
            return this.getChild( arguments[0]);
          } else if (arguments[0].indexOf('/') !== -1) { // path was given
            return this.getChildrenRecursive( arguments[0].split("/"), 0);
          } else {
            var matches = [];
            var kid, kidName;
            for (var i = 0; i < this.getChildCount(); i++) {
              kid = this.getChild(i);
              kidName = kid.getName();
              if (kidName !== null && kidName === arguments[0]) {
                matches.push(kid);
              }
            }
            return matches;
          }
        }else {
          return this.children;
        }
      },
      getChildCount: function(){
        return this.children.length;
      },
      getChildRecursive: function (items, offset) {
        var kid, kidName;
        for(var i = 0; i < this.getChildCount(); i++) {
            kid = this.getChild(i);
            kidName = kid.getName();
            if (kidName !== null && kidName === items[offset]) {
              if (offset === items.length-1) {
                return kid;
              } else {
                offset += 1;
                return kid.getChildRecursive(items, offset);
              }
            }
        }
        return null;
      },
      getChildrenRecursive: function (items, offset) {
        if (offset === items.length-1) {
          return this.getChildren(items[offset]);
        }
        var matches = this.getChildren(items[offset]);
        var kidMatches;
        for (var i = 0; i < matches.length; i++) {
          kidMatches = matches[i].getChildrenRecursive(items, offset+1);
        }
        return kidMatches;
      },
      parseChildrenRecursive: function (parent , elementpath){
        var xmlelement,
          xmlattribute,
          tmpattrib;
        if (!parent) {
          this.fullName = elementpath.localName;
          this.name     = elementpath.nodeName;
          this.content  = elementpath.textContent || "";
          xmlelement    = this;
        } else { // a parent
          xmlelement         = new XMLElement(elementpath.localName, elementpath.nodeName, "", "");
          xmlelement.content = elementpath.textContent || "";
          xmlelement.parent  = parent;
        }

        for (var l = 0; l < elementpath.attributes.length; l++) {
          tmpattrib    = elementpath.attributes[l];
          xmlattribute = new XMLAttribute(tmpattrib.getname , tmpattrib.nodeName, tmpattrib.namespaceURI , tmpattrib.nodeValue , tmpattrib.nodeType);
          xmlelement.attributes.push(xmlattribute);
        }

        for (var node in elementpath.childNodes){
          if(elementpath.childNodes[node].nodeType === 1) { //ELEMENT_NODE type
            xmlelement.children.push( xmlelement.parseChildrenRecursive(xmlelement, elementpath.childNodes[node]));
          }
        }
        return xmlelement;
      },
      isLeaf: function(){
        return this.hasChildren();
      },
      listChildren: function() {
        var arr = [];
        for (var i = 0; i < this.children.length; i++) {
          arr.push( this.getChild(i).getName());
        }
        return arr;
      },
      removeAttribute: function (name , namespace) {
        this.namespace = namespace || "";
        for (var i = 0; i < this.attributes.length; i++){
          if (this.attributes[i].getName() === name && this.attributes[i].getNamespace() === this.namespace) {
            this.attributes.splice(i, 0);
          }
        }
      },
      removeChild: function(child) {
        if (child) {
          for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].equalsXMLElement(child)) {
              this.children.splice(i, 0);
            }
          }
        }
      },
      removeChildAtIndex: function(index) {
        if (this.children.length > index) { //make sure its not outofbounds
          this.children.splice(index, 0);
        }
      },
      findAttribute: function (name, namespace) {
        this.namespace = namespace || "";
        for (var i = 0; i < this.attributes.length; i++ ) {
          if (this.attributes[i].getName() === name && this.attributes[i].getNamespace() === this.namespace) {
             return this.attributes[i];
          }
        }
      },
      setAttribute: function() {
        var attr;
        if (arguments.length === 3) {
          var index = arguments[0].indexOf(':');
          var name  = arguments[0].substring(index + 1);
          attr      = this.findAttribute( name, arguments[1] );
          if (attr) {
            attr.setValue(arguments[2]);
          } else {
            attr = new XMLAttribute(arguments[0], name, arguments[1], arguments[2], "CDATA");
            this.attributes.addElement(attr);
          }
        } else {
          attr = this.findAttribute(arguments[0]);
          if (attr) {
            attr.setValue(arguments[1]);
          } else {
            attr = new XMLAttribute(arguments[0], arguments[0], null, arguments[1], "CDATA");
            this.attributes.addElement(attr);
          }
        }
      },
      setContent: function(content) {
        this.content = content;
      },
      setName: function() {
        if (arguments.length === 1) {
          this.name      = arguments[0];
          this.fullName  = arguments[0];
          this.namespace = arguments[0];
        } else {
          var index = arguments[0].indexOf(':');
          if ((arguments[1] === null) || (index < 0)) {
              this.name = arguments[0];
          } else {
              this.name = arguments[0].substring(index + 1);
          }
          this.fullName  = arguments[0];
          this.namespace = arguments[1];
        }
      },
      getName: function() {
        return this.fullName;
      }
    };


    ////////////////////////////////////////////////////////////////////////////
    // 2D Matrix
    ////////////////////////////////////////////////////////////////////////////

    /*
      Helper function for printMatrix(). Finds the largest scalar
      in the matrix, then number of digits left of the decimal.
      Call from PMatrix2D and PMatrix3D's print() function.
    */
    var printMatrixHelper = function printMatrixHelper(elements) {
      var big = 0;
      for (var i = 0; i < elements.length; i++) {
        if (i !== 0) {
          big = Math.max(big, Math.abs(elements[i]));
        } else {
          big = Math.abs(elements[i]);
        }
      }

      var digits = (big + "").indexOf(".");
      if (digits === 0) {
        digits = 1;
      } else if (digits === -1) {
        digits = (big + "").length;
      }

      return digits;
    };

    var PMatrix2D = p.PMatrix2D = function() {
      if (arguments.length === 0) {
        this.reset();
      } else if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
        this.set(arguments[0].array());
      } else if (arguments.length === 6) {
        this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      }
    };

    PMatrix2D.prototype = {
      set: function() {
        if (arguments.length === 6) {
          var a = arguments;
          this.set([a[0], a[1], a[2],
                    a[3], a[4], a[5]]);
        } else if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
          this.elements = arguments[0].array();
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          this.elements = arguments[0].slice();
        }
      },
      get: function() {
        var outgoing = new PMatrix2D();
        outgoing.set(this.elements);
        return outgoing;
      },
      reset: function() {
        this.set([1, 0, 0, 0, 1, 0]);
      },
      // Returns a copy of the element values.
      array: function array() {
        return this.elements.slice();
      },
      translate: function(tx, ty) {
        this.elements[2] = tx * this.elements[0] + ty * this.elements[1] + this.elements[2];
        this.elements[5] = tx * this.elements[3] + ty * this.elements[4] + this.elements[5];
      },
      transpose: function() {
        // Does nothing in Processing.
      },
      mult: function(source, target) {
        var x, y;
        if (source instanceof PVector) {
          x = source.x;
          y = source.y;
          if (!target) {
            target = new PVector();
          }
        } else if (source instanceof Array) {
          x = source[0];
          y = source[1];
          if (!target) {
            target = [];
          }
        }
        if (target instanceof Array) {
          target[0] = this.elements[0] * x + this.elements[1] * y + this.elements[2];
          target[1] = this.elements[3] * x + this.elements[4] * y + this.elements[5];
        } else if (target instanceof PVector) {
          target.x = this.elements[0] * x + this.elements[1] * y + this.elements[2];
          target.y = this.elements[3] * x + this.elements[4] * y + this.elements[5];
          target.z = 0;
        }
        return target;
      },
      multX: function(x, y) {
        return (x * this.elements[0] + y * this.elements[1] + this.elements[2]);
      },
      multY: function(x, y) {
        return (x * this.elements[3] + y * this.elements[4] + this.elements[5]);
      },
      skewX: function(angle) {
        this.apply(1, 0, 1, angle, 0, 0);
      },
      skewY: function(angle) {
        this.apply(1, 0, 1,  0, angle, 0);
      },
      determinant: function() {
        return (this.elements[0] * this.elements[4] - this.elements[1] * this.elements[3]);
      },
      invert: function() {
        var d = this.determinant();
        if ( Math.abs( d ) > PConstants.FLOAT_MIN ) {
          var old00 = this.elements[0];
          var old01 = this.elements[1];
          var old02 = this.elements[2];
          var old10 = this.elements[3];
          var old11 = this.elements[4];
          var old12 = this.elements[5];
          this.elements[0] =  old11 / d;
          this.elements[3] = -old10 / d;
          this.elements[1] = -old01 / d;
          this.elements[1] =  old00 / d;
          this.elements[2] = (old01 * old12 - old11 * old02) / d;
          this.elements[5] = (old10 * old02 - old00 * old12) / d;
          return true;
        }
        return false;
      },
      scale: function(sx, sy) {
        if (sx && !sy) {
          sy = sx;
        }
        if (sx && sy) {
          this.elements[0] *= sx;
          this.elements[1] *= sy;
          this.elements[3] *= sx;
          this.elements[4] *= sy;
        }
      },
      apply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
          source = arguments[0].array();
        } else if (arguments.length === 6) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }

        var result = [0, 0, this.elements[2],
                      0, 0, this.elements[5]];
        var e = 0;
        for (var row = 0; row < 2; row++) {
          for (var col = 0; col < 3; col++, e++) {
            result[e] += this.elements[row * 3 + 0] * source[col + 0] +
                         this.elements[row * 3 + 1] * source[col + 3];
          }
        }
        this.elements = result.slice();
      },
      preApply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
          source = arguments[0].array();
        } else if (arguments.length === 6) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }
        var result = [0, 0, source[2],
                      0, 0, source[5]];
        result[2] = source[2] + this.elements[2] * source[0] + this.elements[5] * source[1];
        result[5] = source[5] + this.elements[2] * source[3] + this.elements[5] * source[4];
        result[0] = this.elements[0] * source[0] + this.elements[3] * source[1];
        result[3] = this.elements[0] * source[3] + this.elements[3] * source[4];
        result[1] = this.elements[1] * source[0] + this.elements[4] * source[1];
        result[4] = this.elements[1] * source[3] + this.elements[4] * source[4];
        this.elements = result.slice();
      },
      rotate: function(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var temp1 = this.elements[0];
        var temp2 = this.elements[1];
        this.elements[0] =  c * temp1 + s * temp2;
        this.elements[1] = -s * temp1 + c * temp2;
        temp1 = this.elements[3];
        temp2 = this.elements[4];
        this.elements[3] =  c * temp1 + s * temp2;
        this.elements[4] = -s * temp1 + c * temp2;
      },
      rotateZ: function(angle) {
        this.rotate(angle);
      },
      print: function() {
        var digits = printMatrixHelper(this.elements);
        var output = "" + p.nfs(this.elements[0], digits, 4) + " " +
                     p.nfs(this.elements[1], digits, 4) + " " +
                     p.nfs(this.elements[2], digits, 4) + "\n" +
                     p.nfs(this.elements[3], digits, 4) + " " +
                     p.nfs(this.elements[4], digits, 4) + " " +
                     p.nfs(this.elements[5], digits, 4) + "\n\n";
        p.println(output);
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // PMatrix3D
    ////////////////////////////////////////////////////////////////////////////

    var PMatrix3D = p.PMatrix3D = function PMatrix3D() {
      // When a matrix is created, it is set to an identity matrix
      this.reset();
    };

    PMatrix3D.prototype = {
      set: function() {
        if (arguments.length === 16) {
          this.elements = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof PMatrix3D) {
          this.elements = arguments[0].array();
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          this.elements = arguments[0].slice();
        }
      },
      get: function() {
        var outgoing = new PMatrix3D();
        outgoing.set(this.elements);
        return outgoing;
      },
      reset: function() {
        this.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      },
      // Returns a copy of the element values.
      array: function array() {
        return this.elements.slice();
      },
      translate: function(tx, ty, tz) {
        if (tz === undef) {
          tz = 0;
        }

        this.elements[3]  += tx * this.elements[0]  + ty * this.elements[1]  + tz * this.elements[2];
        this.elements[7]  += tx * this.elements[4]  + ty * this.elements[5]  + tz * this.elements[6];
        this.elements[11] += tx * this.elements[8]  + ty * this.elements[9]  + tz * this.elements[10];
        this.elements[15] += tx * this.elements[12] + ty * this.elements[13] + tz * this.elements[14];
      },
      transpose: function() {
        var temp = this.elements.slice();
        this.elements[0]  = temp[0];
        this.elements[1]  = temp[4];
        this.elements[2]  = temp[8];
        this.elements[3]  = temp[12];
        this.elements[4]  = temp[1];
        this.elements[5]  = temp[5];
        this.elements[6]  = temp[9];
        this.elements[7]  = temp[13];
        this.elements[8]  = temp[2];
        this.elements[9]  = temp[6];
        this.elements[10] = temp[10];
        this.elements[11] = temp[14];
        this.elements[12] = temp[3];
        this.elements[13] = temp[7];
        this.elements[14] = temp[11];
        this.elements[15] = temp[15];
      },
      /*
        You must either pass in two PVectors or two arrays,
        don't mix between types. You may also omit a second
        argument and simply read the result from the return.
      */
      mult: function(source, target) {
        var x, y, z, w;
        if (source instanceof PVector) {
          x = source.x;
          y = source.y;
          z = source.z;
          w = 1;
          if (!target) {
            target = new PVector();
          }
        } else if (source instanceof Array) {
          x = source[0];
          y = source[1];
          z = source[2];
          w = source[3] || 1;

          if (!target || target.length !== 3 && target.length !== 4) {
            target = [0, 0, 0];
          }
        }

        if (target instanceof Array) {
          if (target.length === 3) {
            target[0] = this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3];
            target[1] = this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7];
            target[2] = this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11];
          } else if (target.length === 4) {
            target[0] = this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3] * w;
            target[1] = this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7] * w;
            target[2] = this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11] * w;
            target[3] = this.elements[12] * x + this.elements[13] * y + this.elements[14] * z + this.elements[15] * w;
          }
        }
        if (target instanceof PVector) {
          target.x = this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3];
          target.y = this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7];
          target.z = this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11];
        }
        return target;
      },
      preApply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix3D) {
          source = arguments[0].array();
        } else if (arguments.length === 16) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }

        var result = [0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0];
        var e = 0;
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++, e++) {
            result[e] += this.elements[col + 0] * source[row * 4 + 0] + this.elements[col + 4] *
                         source[row * 4 + 1] + this.elements[col + 8] * source[row * 4 + 2] +
                         this.elements[col + 12] * source[row * 4 + 3];
          }
        }
        this.elements = result.slice();
      },
      apply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix3D) {
          source = arguments[0].array();
        } else if (arguments.length === 16) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }

        var result = [0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0];
        var e = 0;
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++, e++) {
            result[e] += this.elements[row * 4 + 0] * source[col + 0] + this.elements[row * 4 + 1] *
                         source[col + 4] + this.elements[row * 4 + 2] * source[col + 8] +
                         this.elements[row * 4 + 3] * source[col + 12];
          }
        }
        this.elements = result.slice();
      },
      rotate: function(angle, v0, v1, v2) {
        if (!v1) {
          this.rotateZ(angle);
        } else {
          // TODO should make sure this vector is normalized
          var c = p.cos(angle);
          var s = p.sin(angle);
          var t = 1.0 - c;

          this.apply((t * v0 * v0) + c,
                     (t * v0 * v1) - (s * v2),
                     (t * v0 * v2) + (s * v1),
                     0,
                     (t * v0 * v1) + (s * v2),
                     (t * v1 * v1) + c,
                     (t * v1 * v2) - (s * v0),
                     0,
                     (t * v0 * v2) - (s * v1),
                     (t * v1 * v2) + (s * v0),
                     (t * v2 * v2) + c,
                     0, 0, 0, 0, 1);
        }
      },
      invApply: function() {
        if (inverseCopy === undef) {
          inverseCopy = new PMatrix3D();
        }
        var a = arguments;
        inverseCopy.set(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8],
                        a[9], a[10], a[11], a[12], a[13], a[14], a[15]);

        if (!inverseCopy.invert()) {
          return false;
        }
        this.preApply(inverseCopy);
        return true;
      },
      rotateX: function(angle) {
        var c = p.cos(angle);
        var s = p.sin(angle);
        this.apply([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
      },

      rotateY: function(angle) {
        var c = p.cos(angle);
        var s = p.sin(angle);
        this.apply([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
      },
      rotateZ: function(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.apply([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      },
      // Uniform scaling if only one value passed in
      scale: function(sx, sy, sz) {
        if (sx && !sy && !sz) {
          sy = sz = sx;
        } else if (sx && sy && !sz) {
          sz = 1;
        }

        if (sx && sy && sz) {
          this.elements[0]  *= sx;
          this.elements[1]  *= sy;
          this.elements[2]  *= sz;
          this.elements[4]  *= sx;
          this.elements[5]  *= sy;
          this.elements[6]  *= sz;
          this.elements[8]  *= sx;
          this.elements[9]  *= sy;
          this.elements[10] *= sz;
          this.elements[12] *= sx;
          this.elements[13] *= sy;
          this.elements[14] *= sz;
        }
      },
      skewX: function(angle) {
        var t = Math.tan(angle);
        this.apply(1, t, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      },
      skewY: function(angle) {
        var t = Math.tan(angle);
        this.apply(1, 0, 0, 0, t, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      },
      multX: function(x, y, z, w) {
        if (!z) {
          return this.elements[0] * x + this.elements[1] * y + this.elements[3];
        } else if (!w) {
          return this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3];
        } else {
          return this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3] * w;
        }
      },
      multY: function(x, y, z, w) {
        if (!z) {
          return this.elements[4] * x + this.elements[5] * y + this.elements[7];
        } else if (!w) {
          return this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7];
        } else {
          return this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7] * w;
        }
      },
      multZ: function(x, y, z, w) {
        if (!w) {
          return this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11];
        } else {
          return this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11] * w;
        }
      },
      multW: function(x, y, z, w) {
        if (!w) {
          return this.elements[12] * x + this.elements[13] * y + this.elements[14] * z + this.elements[15];
        } else {
          return this.elements[12] * x + this.elements[13] * y + this.elements[14] * z + this.elements[15] * w;
        }
      },
      invert: function() {
        var fA0 = this.elements[0] * this.elements[5] - this.elements[1] * this.elements[4];
        var fA1 = this.elements[0] * this.elements[6] - this.elements[2] * this.elements[4];
        var fA2 = this.elements[0] * this.elements[7] - this.elements[3] * this.elements[4];
        var fA3 = this.elements[1] * this.elements[6] - this.elements[2] * this.elements[5];
        var fA4 = this.elements[1] * this.elements[7] - this.elements[3] * this.elements[5];
        var fA5 = this.elements[2] * this.elements[7] - this.elements[3] * this.elements[6];
        var fB0 = this.elements[8] * this.elements[13] - this.elements[9] * this.elements[12];
        var fB1 = this.elements[8] * this.elements[14] - this.elements[10] * this.elements[12];
        var fB2 = this.elements[8] * this.elements[15] - this.elements[11] * this.elements[12];
        var fB3 = this.elements[9] * this.elements[14] - this.elements[10] * this.elements[13];
        var fB4 = this.elements[9] * this.elements[15] - this.elements[11] * this.elements[13];
        var fB5 = this.elements[10] * this.elements[15] - this.elements[11] * this.elements[14];

        // Determinant
        var fDet = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;

        // Account for a very small value
        // return false if not successful.
        if (Math.abs(fDet) <= 1e-9) {
          return false;
        }

        var kInv = [];
        kInv[0]  = +this.elements[5] * fB5 - this.elements[6] * fB4 + this.elements[7] * fB3;
        kInv[4]  = -this.elements[4] * fB5 + this.elements[6] * fB2 - this.elements[7] * fB1;
        kInv[8]  = +this.elements[4] * fB4 - this.elements[5] * fB2 + this.elements[7] * fB0;
        kInv[12] = -this.elements[4] * fB3 + this.elements[5] * fB1 - this.elements[6] * fB0;
        kInv[1]  = -this.elements[1] * fB5 + this.elements[2] * fB4 - this.elements[3] * fB3;
        kInv[5]  = +this.elements[0] * fB5 - this.elements[2] * fB2 + this.elements[3] * fB1;
        kInv[9]  = -this.elements[0] * fB4 + this.elements[1] * fB2 - this.elements[3] * fB0;
        kInv[13] = +this.elements[0] * fB3 - this.elements[1] * fB1 + this.elements[2] * fB0;
        kInv[2]  = +this.elements[13] * fA5 - this.elements[14] * fA4 + this.elements[15] * fA3;
        kInv[6]  = -this.elements[12] * fA5 + this.elements[14] * fA2 - this.elements[15] * fA1;
        kInv[10] = +this.elements[12] * fA4 - this.elements[13] * fA2 + this.elements[15] * fA0;
        kInv[14] = -this.elements[12] * fA3 + this.elements[13] * fA1 - this.elements[14] * fA0;
        kInv[3]  = -this.elements[9] * fA5 + this.elements[10] * fA4 - this.elements[11] * fA3;
        kInv[7]  = +this.elements[8] * fA5 - this.elements[10] * fA2 + this.elements[11] * fA1;
        kInv[11] = -this.elements[8] * fA4 + this.elements[9] * fA2 - this.elements[11] * fA0;
        kInv[15] = +this.elements[8] * fA3 - this.elements[9] * fA1 + this.elements[10] * fA0;

        // Inverse using Determinant
        var fInvDet = 1.0 / fDet;
        kInv[0]  *= fInvDet;
        kInv[1]  *= fInvDet;
        kInv[2]  *= fInvDet;
        kInv[3]  *= fInvDet;
        kInv[4]  *= fInvDet;
        kInv[5]  *= fInvDet;
        kInv[6]  *= fInvDet;
        kInv[7]  *= fInvDet;
        kInv[8]  *= fInvDet;
        kInv[9]  *= fInvDet;
        kInv[10] *= fInvDet;
        kInv[11] *= fInvDet;
        kInv[12] *= fInvDet;
        kInv[13] *= fInvDet;
        kInv[14] *= fInvDet;
        kInv[15] *= fInvDet;

        this.elements = kInv.slice();
        return true;
      },
      toString: function() {
        var str = "";
        for (var i = 0; i < 15; i++) {
          str += this.elements[i] + ", ";
        }
        str += this.elements[15];
        return str;
      },
      print: function() {
        var digits = printMatrixHelper(this.elements);

        var output = "" + p.nfs(this.elements[0], digits, 4) + " " + p.nfs(this.elements[1], digits, 4) +
                     " " + p.nfs(this.elements[2], digits, 4) + " " + p.nfs(this.elements[3], digits, 4) +
                     "\n" + p.nfs(this.elements[4], digits, 4) + " " + p.nfs(this.elements[5], digits, 4) +
                     " " + p.nfs(this.elements[6], digits, 4) + " " + p.nfs(this.elements[7], digits, 4) +
                     "\n" + p.nfs(this.elements[8], digits, 4) + " " + p.nfs(this.elements[9], digits, 4) +
                     " " + p.nfs(this.elements[10], digits, 4) + " " + p.nfs(this.elements[11], digits, 4) +
                     "\n" + p.nfs(this.elements[12], digits, 4) + " " + p.nfs(this.elements[13], digits, 4) +
                     " " + p.nfs(this.elements[14], digits, 4) + " " + p.nfs(this.elements[15], digits, 4) + "\n\n";
        p.println(output);
      },
      invTranslate: function(tx, ty, tz) {
        this.preApply(1, 0, 0, -tx, 0, 1, 0, -ty, 0, 0, 1, -tz, 0, 0, 0, 1);
      },
      invRotateX: function(angle) {
        var c = Math.cos(-angle);
        var s = Math.sin(-angle);
        this.preApply([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
      },
      invRotateY: function(angle) {
        var c = Math.cos(-angle);
        var s = Math.sin(-angle);
        this.preApply([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
      },
      invRotateZ: function(angle) {
        var c = Math.cos(-angle);
        var s = Math.sin(-angle);
        this.preApply([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      },
      invScale: function(x, y, z) {
        this.preApply([1 / x, 0, 0, 0, 0, 1 / y, 0, 0, 0, 0, 1 / z, 0, 0, 0, 0, 1]);
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Matrix Stack
    ////////////////////////////////////////////////////////////////////////////

    var PMatrixStack = p.PMatrixStack = function PMatrixStack() {
      this.matrixStack = [];
    };

    PMatrixStack.prototype.load = function load() {
      var tmpMatrix;
      if (p.use3DContext) {
        tmpMatrix = new PMatrix3D();
      } else {
        tmpMatrix = new PMatrix2D();
      }

      if (arguments.length === 1) {
        tmpMatrix.set(arguments[0]);
      } else {
        tmpMatrix.set(arguments);
      }
      this.matrixStack.push(tmpMatrix);
    };

    PMatrixStack.prototype.push = function push() {
      this.matrixStack.push(this.peek());
    };

    PMatrixStack.prototype.pop = function pop() {
      return this.matrixStack.pop();
    };

    PMatrixStack.prototype.peek = function peek() {
      var tmpMatrix;
      if (p.use3DContext) {
        tmpMatrix = new PMatrix3D();
      } else {
        tmpMatrix = new PMatrix2D();
      }

      tmpMatrix.set(this.matrixStack[this.matrixStack.length - 1]);
      return tmpMatrix;
    };

    PMatrixStack.prototype.mult = function mult(matrix) {
      this.matrixStack[this.matrixStack.length - 1].apply(matrix);
    };

    ////////////////////////////////////////////////////////////////////////////
    // Array handling
    ////////////////////////////////////////////////////////////////////////////

    p.split = function(str, delim) {
      return str.split(delim);
    };

    p.splitTokens = function(str, tokens) {
      if (arguments.length === 1) {
        tokens = "\n\t\r\f ";
      }

      tokens = "[" + tokens + "]";

      var ary = [];
      var index = 0;
      var pos = str.search(tokens);

      while (pos >= 0) {
        if (pos === 0) {
          str = str.substring(1);
        } else {
          ary[index] = str.substring(0, pos);
          index++;
          str = str.substring(pos);
        }
        pos = str.search(tokens);
      }

      if (str.length > 0) {
        ary[index] = str;
      }

      if (ary.length === 0) {
        ary = undef;
      }

      return ary;
    };

    p.append = function(array, element) {
      array[array.length] = element;
      return array;
    };

    p.concat = function(array1, array2) {
      return array1.concat(array2);
    };

    p.sort = function(array, numElem) {
      var ret = [];

      // depending on the type used (int, float) or string
      // we'll need to use a different compare function
      if (array.length > 0) {
        // copy since we need to return another array
        var elemsToCopy = numElem > 0 ? numElem : array.length;
        for (var i = 0; i < elemsToCopy; i++) {
          ret.push(array[i]);
        }
        if (typeof array[0] === "string") {
          ret.sort();
        }
        // int or float
        else {
          ret.sort(function(a, b) {
            return a - b;
          });
        }

        // copy on the rest of the elements that were not sorted in case the user
        // only wanted a subset of an array to be sorted.
        if (numElem > 0) {
          for (var j = ret.length; j < array.length; j++) {
            ret.push(array[j]);
          }
        }
      }
      return ret;
    };

    /**
      splice inserts "value" which can be either a scalar or an array
      into "array" at position "index".
    */
    p.splice = function(array, value, index) {

      // Trying to splice an empty array into "array" in P5 won't do
      // anything, just return the original.
      if(value.length === 0)
      {
        return array;
      }

      // If the second argument was an array, we'll need to iterate over all
      // the "value" elements and add one by one because
      // array.splice(index, 0, value);
      // would create a multi-dimensional array which isn't what we want.
      if(value instanceof Array) {
        for(var i = 0, j = index; i < value.length; j++,i++) {
          array.splice(j, 0, value[i]);
        }
      } else {
        array.splice(index, 0, value);
      }

      return array;
    };

    p.subset = function(array, offset, length) {
      if (arguments.length === 2) {
        return array.slice(offset, array.length - offset);
      } else if (arguments.length === 3) {
        return array.slice(offset, offset + length);
      }
    };

    p.join = function(array, seperator) {
      return array.join(seperator);
    };

    p.shorten = function(ary) {
      var newary = [];

      // copy array into new array
      var len = ary.length;
      for (var i = 0; i < len; i++) {
        newary[i] = ary[i];
      }
      newary.pop();

      return newary;
    };

    p.expand = function(ary, newSize) {
      var temp = ary.slice(0);
      if (arguments.length === 1) {
        // double size of array
        temp.length = ary.length * 2;
        return temp;
      } else if (arguments.length === 2) {
        // size is newSize
        temp.length = newSize;
        return temp;
      }
    };

    p.arrayCopy = function() { // src, srcPos, dest, destPos, length) {
      var src, srcPos = 0, dest, destPos = 0, length;

      if (arguments.length === 2) {
        // recall itself and copy src to dest from start index 0 to 0 of src.length
        src = arguments[0];
        dest = arguments[1];
        length = src.length;
      } else if (arguments.length === 3) {
        // recall itself and copy src to dest from start index 0 to 0 of length
        src = arguments[0];
        dest = arguments[1];
        length = arguments[2];
      } else if (arguments.length === 5) {
        src = arguments[0];
        srcPos = arguments[1];
        dest = arguments[2];
        destPos = arguments[3];
        length = arguments[4];
      }

      // copy src to dest from index srcPos to index destPos of length recursivly on objects
      for (var i = srcPos, j = destPos; i < length + srcPos; i++, j++) {
        if (dest[j] !== undef) {
          dest[j] = src[i];
        } else {
          throw "array index out of bounds exception";
        }
      }
    };

    p.reverse = function(array) {
      return array.reverse();
    };


    ////////////////////////////////////////////////////////////////////////////
    // Color functions
    ////////////////////////////////////////////////////////////////////////////

    // helper functions for internal blending modes
    p.mix = function(a, b, f) {
      return a + (((b - a) * f) >> 8);
    };

    p.peg = function(n) {
      return (n < 0) ? 0 : ((n > 255) ? 255 : n);
    };

    // blending modes
    p.modes = {
      replace: function(c1, c2) {
        return c2;
      },
      blend: function(c1, c2) {
        var f = (c2 & PConstants.ALPHA_MASK) >>> 24;
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                p.mix(c1 & PConstants.RED_MASK, c2 & PConstants.RED_MASK, f) & PConstants.RED_MASK |
                p.mix(c1 & PConstants.GREEN_MASK, c2 & PConstants.GREEN_MASK, f) & PConstants.GREEN_MASK |
                p.mix(c1 & PConstants.BLUE_MASK, c2 & PConstants.BLUE_MASK, f));
      },
      add: function(c1, c2) {
        var f = (c2 & PConstants.ALPHA_MASK) >>> 24;
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                Math.min(((c1 & PConstants.RED_MASK) + ((c2 & PConstants.RED_MASK) >> 8) * f), PConstants.RED_MASK) & PConstants.RED_MASK |
                Math.min(((c1 & PConstants.GREEN_MASK) + ((c2 & PConstants.GREEN_MASK) >> 8) * f), PConstants.GREEN_MASK) & PConstants.GREEN_MASK |
                Math.min((c1 & PConstants.BLUE_MASK) + (((c2 & PConstants.BLUE_MASK) * f) >> 8), PConstants.BLUE_MASK));
      },
      subtract: function(c1, c2) {
        var f = (c2 & PConstants.ALPHA_MASK) >>> 24;
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                Math.max(((c1 & PConstants.RED_MASK) - ((c2 & PConstants.RED_MASK) >> 8) * f), PConstants.GREEN_MASK) & PConstants.RED_MASK |
                Math.max(((c1 & PConstants.GREEN_MASK) - ((c2 & PConstants.GREEN_MASK) >> 8) * f), PConstants.BLUE_MASK) & PConstants.GREEN_MASK |
                Math.max((c1 & PConstants.BLUE_MASK) - (((c2 & PConstants.BLUE_MASK) * f) >> 8), 0));
      },
      lightest: function(c1, c2) {
        var f = (c2 & PConstants.ALPHA_MASK) >>> 24;
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                Math.max(c1 & PConstants.RED_MASK, ((c2 & PConstants.RED_MASK) >> 8) * f) & PConstants.RED_MASK |
                Math.max(c1 & PConstants.GREEN_MASK, ((c2 & PConstants.GREEN_MASK) >> 8) * f) & PConstants.GREEN_MASK |
                Math.max(c1 & PConstants.BLUE_MASK, ((c2 & PConstants.BLUE_MASK) * f) >> 8));
      },
      darkest: function(c1, c2) {
        var f = (c2 & PConstants.ALPHA_MASK) >>> 24;
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                p.mix(c1 & PConstants.RED_MASK, Math.min(c1 & PConstants.RED_MASK, ((c2 & PConstants.RED_MASK) >> 8) * f), f) & PConstants.RED_MASK |
                p.mix(c1 & PConstants.GREEN_MASK, Math.min(c1 & PConstants.GREEN_MASK, ((c2 & PConstants.GREEN_MASK) >> 8) * f), f) & PConstants.GREEN_MASK |
                p.mix(c1 & PConstants.BLUE_MASK, Math.min(c1 & PConstants.BLUE_MASK, ((c2 & PConstants.BLUE_MASK) * f) >> 8), f));
      },
      difference: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = (ar > br) ? (ar - br) : (br - ar);
        var cg = (ag > bg) ? (ag - bg) : (bg - ag);
        var cb = (ab > bb) ? (ab - bb) : (bb - ab);
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      exclusion: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = ar + br - ((ar * br) >> 7);
        var cg = ag + bg - ((ag * bg) >> 7);
        var cb = ab + bb - ((ab * bb) >> 7);
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      multiply: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = (ar * br) >> 8;
        var cg = (ag * bg) >> 8;
        var cb = (ab * bb) >> 8;
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      screen: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = 255 - (((255 - ar) * (255 - br)) >> 8);
        var cg = 255 - (((255 - ag) * (255 - bg)) >> 8);
        var cb = 255 - (((255 - ab) * (255 - bb)) >> 8);
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      hard_light: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = (br < 128) ? ((ar * br) >> 7) : (255 - (((255 - ar) * (255 - br)) >> 7));
        var cg = (bg < 128) ? ((ag * bg) >> 7) : (255 - (((255 - ag) * (255 - bg)) >> 7));
        var cb = (bb < 128) ? ((ab * bb) >> 7) : (255 - (((255 - ab) * (255 - bb)) >> 7));
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      soft_light: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = ((ar * br) >> 7) + ((ar * ar) >> 8) - ((ar * ar * br) >> 15);
        var cg = ((ag * bg) >> 7) + ((ag * ag) >> 8) - ((ag * ag * bg) >> 15);
        var cb = ((ab * bb) >> 7) + ((ab * ab) >> 8) - ((ab * ab * bb) >> 15);
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      overlay: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = (ar < 128) ? ((ar * br) >> 7) : (255 - (((255 - ar) * (255 - br)) >> 7));
        var cg = (ag < 128) ? ((ag * bg) >> 7) : (255 - (((255 - ag) * (255 - bg)) >> 7));
        var cb = (ab < 128) ? ((ab * bb) >> 7) : (255 - (((255 - ab) * (255 - bb)) >> 7));
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      dodge: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = (br === 255) ? 255 : p.peg((ar << 8) / (255 - br)); // division requires pre-peg()-ing
        var cg = (bg === 255) ? 255 : p.peg((ag << 8) / (255 - bg)); // "
        var cb = (bb === 255) ? 255 : p.peg((ab << 8) / (255 - bb)); // "
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      },
      burn: function(c1, c2) {
        var f  = (c2 & PConstants.ALPHA_MASK) >>> 24;
        var ar = (c1 & PConstants.RED_MASK) >> 16;
        var ag = (c1 & PConstants.GREEN_MASK) >> 8;
        var ab = (c1 & PConstants.BLUE_MASK);
        var br = (c2 & PConstants.RED_MASK) >> 16;
        var bg = (c2 & PConstants.GREEN_MASK) >> 8;
        var bb = (c2 & PConstants.BLUE_MASK);
        // formula:
        var cr = (br === 0) ? 0 : 255 - p.peg(((255 - ar) << 8) / br); // division requires pre-peg()-ing
        var cg = (bg === 0) ? 0 : 255 - p.peg(((255 - ag) << 8) / bg); // "
        var cb = (bb === 0) ? 0 : 255 - p.peg(((255 - ab) << 8) / bb); // "
        // alpha blend (this portion will always be the same)
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                (p.peg(ar + (((cr - ar) * f) >> 8)) << 16) |
                (p.peg(ag + (((cg - ag) * f) >> 8)) << 8) |
                (p.peg(ab + (((cb - ab) * f) >> 8))));
      }
    };

    function color$4(aValue1, aValue2, aValue3, aValue4) {
      var r, g, b, a;

      if (curColorMode === PConstants.HSB) {
        var rgb = p.color.toRGB(aValue1, aValue2, aValue3);
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
      } else {
        r = Math.round(255 * (aValue1 / colorModeX));
        g = Math.round(255 * (aValue2 / colorModeY));
        b = Math.round(255 * (aValue3 / colorModeZ));
      }

      a = Math.round(255 * (aValue4 / colorModeA));

      // Limit values greater than 255
      r = (r > 255) ? 255 : r;
      g = (g > 255) ? 255 : g;
      b = (b > 255) ? 255 : b;
      a = (a > 255) ? 255 : a;

      // Create color int
      return (a << 24) & PConstants.ALPHA_MASK | (r << 16) & PConstants.RED_MASK | (g << 8) & PConstants.GREEN_MASK | b & PConstants.BLUE_MASK;
    }

    function color$2(aValue1, aValue2) {
      var a;

      // Color int and alpha
      if (aValue1 & PConstants.ALPHA_MASK) {
        a = Math.round(255 * (aValue2 / colorModeA));
        a = (a > 255) ? 255 : a;

        return aValue1 - (aValue1 & PConstants.ALPHA_MASK) + ((a << 24) & PConstants.ALPHA_MASK);
      }
      // Grayscale and alpha
      else {
        if (curColorMode === PConstants.RGB) {
          return color$4(aValue1, aValue1, aValue1, aValue2);
        } else if (curColorMode === PConstants.HSB) {
          return color$4(0, 0, (aValue1 / colorModeX) * colorModeZ, aValue2);
        }
      }
    }

    function color$1(aValue1) {
      // Grayscale
      if (aValue1 <= colorModeX && aValue1 >= 0) {
          if (curColorMode === PConstants.RGB) {
            return color$4(aValue1, aValue1, aValue1, colorModeA);
          } else if (curColorMode === PConstants.HSB) {
            return color$4(0, 0, (aValue1 / colorModeX) * colorModeZ, colorModeA);
          }
      }
      // Color int
      else if (aValue1) {
        return aValue1;
      }
    }

    p.color = function color(aValue1, aValue2, aValue3, aValue4) {
      // 4 arguments: (R, G, B, A) or (H, S, B, A)
      if (aValue1 !== undef && aValue2 !== undef && aValue3 !== undef && aValue4 !== undef) {
        return color$4(aValue1, aValue2, aValue3, aValue4);
      }

      // 3 arguments: (R, G, B) or (H, S, B)
      else if (aValue1 !== undef && aValue2 !== undef && aValue3 !== undef) {
        return color$4(aValue1, aValue2, aValue3, colorModeA);
      }

      // 2 arguments: (Color, A) or (Grayscale, A)
      else if (aValue1 !== undef && aValue2 !== undef) {
        return color$2(aValue1, aValue2);
      }

      // 1 argument: (Grayscale) or (Color)
      else if (typeof aValue1 === "number") {
        return color$1(aValue1);
      }

      // Default
      else {
        return color$4(colorModeX, colorModeY, colorModeZ, colorModeA);
      }
    };

    // Ease of use function to extract the colour bits into a string
    p.color.toString = function(colorInt) {
      return "rgba(" + ((colorInt & PConstants.RED_MASK) >>> 16) + "," + ((colorInt & PConstants.GREEN_MASK) >>> 8) +
             "," + ((colorInt & PConstants.BLUE_MASK)) + "," + ((colorInt & PConstants.ALPHA_MASK) >>> 24) / 255 + ")";
    };

    // Easy of use function to pack rgba values into a single bit-shifted color int.
    p.color.toInt = function(r, g, b, a) {
      return (a << 24) & PConstants.ALPHA_MASK | (r << 16) & PConstants.RED_MASK | (g << 8) & PConstants.GREEN_MASK | b & PConstants.BLUE_MASK;
    };

    // Creates a simple array in [R, G, B, A] format, [255, 255, 255, 255]
    p.color.toArray = function(colorInt) {
      return [(colorInt & PConstants.RED_MASK) >>> 16, (colorInt & PConstants.GREEN_MASK) >>> 8,
              colorInt & PConstants.BLUE_MASK, (colorInt & PConstants.ALPHA_MASK) >>> 24];
    };

    // Creates a WebGL color array in [R, G, B, A] format. WebGL wants the color ranges between 0 and 1, [1, 1, 1, 1]
    p.color.toGLArray = function(colorInt) {
      return [((colorInt & PConstants.RED_MASK) >>> 16) / 255, ((colorInt & PConstants.GREEN_MASK) >>> 8) / 255,
              (colorInt & PConstants.BLUE_MASK) / 255, ((colorInt & PConstants.ALPHA_MASK) >>> 24) / 255];
    };

    // HSB conversion function from Mootools, MIT Licensed
    p.color.toRGB = function(h, s, b) {
      // Limit values greater than range
      h = (h > colorModeX) ? colorModeX : h;
      s = (s > colorModeY) ? colorModeY : s;
      b = (b > colorModeZ) ? colorModeZ : b;

      h = (h / colorModeX) * 360;
      s = (s / colorModeY) * 100;
      b = (b / colorModeZ) * 100;

      var br = Math.round(b / 100 * 255);

      if (s === 0) { // Grayscale
        return [br, br, br];
      } else {
        var hue = h % 360;
        var f = hue % 60;
        var p = Math.round((b * (100 - s)) / 10000 * 255);
        var q = Math.round((b * (6000 - s * f)) / 600000 * 255);
        var t = Math.round((b * (6000 - s * (60 - f))) / 600000 * 255);
        switch (Math.floor(hue / 60)) {
        case 0:
          return [br, t, p];
        case 1:
          return [q, br, p];
        case 2:
          return [p, br, t];
        case 3:
          return [p, q, br];
        case 4:
          return [t, p, br];
        case 5:
          return [br, p, q];
        }
      }
    };

    p.color.toHSB = function( colorInt ) {
      var red, green, blue;

      red   = ((colorInt & PConstants.RED_MASK) >>> 16) / 255;
      green = ((colorInt & PConstants.GREEN_MASK) >>> 8) / 255;
      blue  = (colorInt & PConstants.BLUE_MASK) / 255;

      var max = p.max(p.max(red,green), blue),
          min = p.min(p.min(red,green), blue),
          hue, saturation;

      if (min === max) {
        return [0, 0, max];
      } else {
        saturation = (max - min) / max;

        if (red === max) {
          hue = (green - blue) / (max - min);
        } else if (green === max) {
          hue = 2 + ((blue - red) / (max - min));
        } else {
          hue = 4 + ((red - green) / (max - min));
        }

        hue /= 6;

        if (hue < 0) {
          hue += 1;
        } else if (hue > 1) {
          hue -= 1;
        }
      }
      return [hue*colorModeX, saturation*colorModeY, max*colorModeZ];
    };

    p.brightness = function(colInt){
      return  p.color.toHSB(colInt)[2];
    };

    p.saturation = function(colInt){
      return  p.color.toHSB(colInt)[1];
    };

    p.hue = function(colInt){
      return  p.color.toHSB(colInt)[0];
    };

    var verifyChannel = function verifyChannel(aColor) {
      if (aColor.constructor === Array) {
        return aColor;
      } else {
        return p.color(aColor);
      }
    };

    p.red = function(aColor) {
      return ((aColor & PConstants.RED_MASK) >>> 16) / 255 * colorModeX;
    };

    p.green = function(aColor) {
      return ((aColor & PConstants.GREEN_MASK) >>> 8) / 255 * colorModeY;
    };

    p.blue = function(aColor) {
      return (aColor & PConstants.BLUE_MASK) / 255 * colorModeZ;
    };

    p.alpha = function(aColor) {
      return ((aColor & PConstants.ALPHA_MASK) >>> 24) / 255 * colorModeA;
    };

    p.lerpColor = function lerpColor(c1, c2, amt) {
      // Get RGBA values for Color 1 to floats
      var colorBits1 = p.color(c1);
      var r1 = (colorBits1 & PConstants.RED_MASK) >>> 16;
      var g1 = (colorBits1 & PConstants.GREEN_MASK) >>> 8;
      var b1 = (colorBits1 & PConstants.BLUE_MASK);
      var a1 = ((colorBits1 & PConstants.ALPHA_MASK) >>> 24) / colorModeA;

      // Get RGBA values for Color 2 to floats
      var colorBits2 = p.color(c2);
      var r2 = (colorBits2 & PConstants.RED_MASK) >>> 16;
      var g2 = (colorBits2 & PConstants.GREEN_MASK) >>> 8;
      var b2 = (colorBits2 & PConstants.BLUE_MASK);
      var a2 = ((colorBits2 & PConstants.ALPHA_MASK) >>> 24) / colorModeA;

      // Return lerp value for each channel, INT for color, Float for Alpha-range
      var r = parseInt(p.lerp(r1, r2, amt), 10);
      var g = parseInt(p.lerp(g1, g2, amt), 10);
      var b = parseInt(p.lerp(b1, b2, amt), 10);
      var a = parseFloat(p.lerp(a1, a2, amt) * colorModeA);

      return p.color.toInt(r, g, b, a);
    };

    // Forced default color mode for #aaaaaa style
    p.defaultColor = function(aValue1, aValue2, aValue3) {
      var tmpColorMode = curColorMode;
      curColorMode = PConstants.RGB;
      var c = p.color(aValue1 / 255 * colorModeX, aValue2 / 255 * colorModeY, aValue3 / 255 * colorModeZ);
      curColorMode = tmpColorMode;
      return c;
    };

    p.colorMode = function colorMode() { // mode, range1, range2, range3, range4
      curColorMode = arguments[0];
      if (arguments.length > 1) {
        colorModeX   = arguments[1];
        colorModeY   = arguments[2] || arguments[1];
        colorModeZ   = arguments[3] || arguments[1];
        colorModeA   = arguments[4] || arguments[1];
      }
    };

    p.blendColor = function(c1, c2, mode) {
      var color = 0;
      switch (mode) {
      case PConstants.REPLACE:
        color = p.modes.replace(c1, c2);
        break;
      case PConstants.BLEND:
        color = p.modes.blend(c1, c2);
        break;
      case PConstants.ADD:
        color = p.modes.add(c1, c2);
        break;
      case PConstants.SUBTRACT:
        color = p.modes.subtract(c1, c2);
        break;
      case PConstants.LIGHTEST:
        color = p.modes.lightest(c1, c2);
        break;
      case PConstants.DARKEST:
        color = p.modes.darkest(c1, c2);
        break;
      case PConstants.DIFFERENCE:
        color = p.modes.difference(c1, c2);
        break;
      case PConstants.EXCLUSION:
        color = p.modes.exclusion(c1, c2);
        break;
      case PConstants.MULTIPLY:
        color = p.modes.multiply(c1, c2);
        break;
      case PConstants.SCREEN:
        color = p.modes.screen(c1, c2);
        break;
      case PConstants.HARD_LIGHT:
        color = p.modes.hard_light(c1, c2);
        break;
      case PConstants.SOFT_LIGHT:
        color = p.modes.soft_light(c1, c2);
        break;
      case PConstants.OVERLAY:
        color = p.modes.overlay(c1, c2);
        break;
      case PConstants.DODGE:
        color = p.modes.dodge(c1, c2);
        break;
      case PConstants.BURN:
        color = p.modes.burn(c1, c2);
        break;
      }
      return color;
    };

    ////////////////////////////////////////////////////////////////////////////
    // Canvas-Matrix manipulation
    ////////////////////////////////////////////////////////////////////////////

    function saveContext() {
      curContext.save();
    }

    function restoreContext() {
      curContext.restore();
      isStrokeDirty = true;
      isFillDirty = true;
    }

    p.printMatrix = function printMatrix() {
      modelView.print();
    };

    p.translate = function translate(x, y, z) {
      if (p.use3DContext) {
        forwardTransform.translate(x, y, z);
        reverseTransform.invTranslate(x, y, z);
      } else {
        curContext.translate(x, y);
      }
    };

    p.scale = function scale(x, y, z) {
      if (p.use3DContext) {
        forwardTransform.scale(x, y, z);
        reverseTransform.invScale(x, y, z);
      } else {
        curContext.scale(x, y || x);
      }
    };

    p.pushMatrix = function pushMatrix() {
      if (p.use3DContext) {
        userMatrixStack.load(modelView);
      } else {
        saveContext();
      }
    };

    p.popMatrix = function popMatrix() {
      if (p.use3DContext) {
        modelView.set(userMatrixStack.pop());
      } else {
        restoreContext();
      }
    };

    p.resetMatrix = function resetMatrix() {
      if (p.use3DContext) {
        forwardTransform.reset();
        reverseTransform.reset();
      } else {
        curContext.setTransform(1,0,0,1,0,0);
      }
    };

    p.applyMatrix = function applyMatrix() {
      var a = arguments;
      if (!p.use3DContext) {
        for (var cnt = a.length; cnt < 16; cnt++) {
          a[cnt] = 0;
        }
        a[10] = a[15] = 1;
      }

      forwardTransform.apply(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
      reverseTransform.invApply(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
    };

    p.rotateX = function(angleInRadians) {
      forwardTransform.rotateX(angleInRadians);
      reverseTransform.invRotateX(angleInRadians);
    };

    p.rotateZ = function(angleInRadians) {
      forwardTransform.rotateZ(angleInRadians);
      reverseTransform.invRotateZ(angleInRadians);
    };

    p.rotateY = function(angleInRadians) {
      forwardTransform.rotateY(angleInRadians);
      reverseTransform.invRotateY(angleInRadians);
    };

    p.rotate = function rotate(angleInRadians) {
      if (p.use3DContext) {
        forwardTransform.rotateZ(angleInRadians);
        reverseTransform.invRotateZ(angleInRadians);
      } else {
        curContext.rotate(angleInRadians);
      }
    };

    p.pushStyle = function pushStyle() {
      // Save the canvas state.
      saveContext();

      p.pushMatrix();

      var newState = {
        'doFill': doFill,
        'currentFillColor': currentFillColor,
        'doStroke': doStroke,
        'currentStrokeColor': currentStrokeColor,
        'curTint': curTint,
        'curRectMode': curRectMode,
        'curColorMode': curColorMode,
        'colorModeX': colorModeX,
        'colorModeZ': colorModeZ,
        'colorModeY': colorModeY,
        'colorModeA': colorModeA,
        'curTextFont': curTextFont,
        'curTextSize': curTextSize
      };

      styleArray.push(newState);
    };

    p.popStyle = function popStyle() {
      var oldState = styleArray.pop();

      if (oldState) {
        restoreContext();

        p.popMatrix();

        doFill = oldState.doFill;
        currentFillColor = oldState.currentFillColor;
        doStroke = oldState.doStroke;
        currentStrokeColor = oldState.currentStrokeColor;
        curTint = oldState.curTint;
        curRectMode = oldState.curRectmode;
        curColorMode = oldState.curColorMode;
        colorModeX = oldState.colorModeX;
        colorModeZ = oldState.colorModeZ;
        colorModeY = oldState.colorModeY;
        colorModeA = oldState.colorModeA;
        curTextFont = oldState.curTextFont;
        curTextSize = oldState.curTextSize;
      } else {
        throw "Too many popStyle() without enough pushStyle()";
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Time based functions
    ////////////////////////////////////////////////////////////////////////////

    p.year = function year() {
      return new Date().getFullYear();
    };
    p.month = function month() {
      return new Date().getMonth() + 1;
    };
    p.day = function day() {
      return new Date().getDate();
    };
    p.hour = function hour() {
      return new Date().getHours();
    };
    p.minute = function minute() {
      return new Date().getMinutes();
    };
    p.second = function second() {
      return new Date().getSeconds();
    };
    p.millis = function millis() {
      return new Date().getTime() - start;
    };

    p.redraw = function redraw() {
      var sec = (new Date().getTime() - timeSinceLastFPS) / 1000;
      framesSinceLastFPS++;
      var fps = framesSinceLastFPS / sec;

      // recalculate FPS every half second for better accuracy.
      if (sec > 0.5) {
        timeSinceLastFPS = new Date().getTime();
        framesSinceLastFPS = 0;
        p.__frameRate = fps;
      }

      p.frameCount++;

      inDraw = true;

      if (p.use3DContext) {
        // even if the color buffer isn't cleared with background(),
        // the depth buffer needs to be cleared regardless.
        curContext.clear(curContext.DEPTH_BUFFER_BIT);
        // Delete all the lighting states and the materials the
        // user set in the last draw() call.
        p.noLights();
        p.lightFalloff(1, 0, 0);
        p.shininess(1);
        p.ambient(255, 255, 255);
        p.specular(0, 0, 0);
        p.camera();
        p.draw();
      } else {
        saveContext();
        p.draw();
        restoreContext();
      }

      inDraw = false;
    };

    p.noLoop = function noLoop() {
      doLoop = false;
      loopStarted = false;
      clearInterval(looping);
    };

    p.loop = function loop() {
      if (loopStarted) {
        return;
      }

      looping = window.setInterval(function() {
        try {
          if (document.hasFocus instanceof Function) {
            p.focused = document.hasFocus();
          }
          p.redraw();
        } catch(e_loop) {
          window.clearInterval(looping);
          throw e_loop;
        }
      }, curMsPerFrame);

      doLoop = true;
      loopStarted = true;
    };

    p.frameRate = function frameRate(aRate) {
      curFrameRate = aRate;
      curMsPerFrame = 1000 / curFrameRate;

      // clear and reset interval
      if (doLoop) {
        p.noLoop();
        p.loop();
      }
    };

    var eventHandlers = [];

    p.exit = function exit() {
      window.clearInterval(looping);

      Processing.removeInstance(p.externals.canvas.id);

      for (var i=0, ehl=eventHandlers.length; i<ehl; i++) {
        var elem = eventHandlers[i][0],
            type = eventHandlers[i][1],
            fn   = eventHandlers[i][2];

        if (elem.removeEventListener) {
          elem.removeEventListener(type, fn, false);
        } else if (elem.detachEvent) {
          elem.detachEvent("on" + type, fn);
        }
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // MISC functions
    ////////////////////////////////////////////////////////////////////////////

    p.cursor = function cursor() {
      if (arguments.length > 1 || (arguments.length === 1 && arguments[0] instanceof p.PImage)) {
        var image = arguments[0],
          x, y;
        if (arguments.length >= 3) {
          x = arguments[1];
          y = arguments[2];
          if (x < 0 || y < 0 || y >= image.height || x >= image.width) {
            throw "x and y must be non-negative and less than the dimensions of the image";
          }
        } else {
          x = image.width >>> 1;
          y = image.height >>> 1;
        }

        // see https://developer.mozilla.org/en/Using_URL_values_for_the_cursor_property
        var imageDataURL = image.toDataURL();
        var style = "url(\"" + imageDataURL + "\") " + x + " " + y + ", default";
        curCursor = curElement.style.cursor = style;
      } else if (arguments.length === 1) {
        var mode = arguments[0];
        curCursor = curElement.style.cursor = mode;
      } else {
        curCursor = curElement.style.cursor = oldCursor;
      }
    };

    p.noCursor = function noCursor() {
      curCursor = curElement.style.cursor = PConstants.NOCURSOR;
    };

    p.link = function(href, target) {
      if (target !== undef) {
        window.open(href, target);
      } else {
        window.location = href;
      }
    };

    // PGraphics methods
    // TODO: These functions are suppose to be called before any operations are called on the
    //       PGraphics object. They currently do nothing.
    p.beginDraw = function beginDraw() {};
    p.endDraw = function endDraw() {};

    // Imports an external Processing.js library
    p.Import = function Import(lib) {
      // Replace evil-eval method with a DOM <script> tag insert method that
      // binds new lib code to the Processing.lib names-space and the current
      // p context. -F1LT3R
    };

    var contextMenu = function(e) {
      e.preventDefault();
      e.stopPropagation();
    };

    p.disableContextMenu = function disableContextMenu() {
      curElement.addEventListener('contextmenu', contextMenu, false);
    };

    p.enableContextMenu = function enableContextMenu() {
      curElement.removeEventListener('contextmenu', contextMenu, false);
    };

    p.status = function(text) {
      window.status = text;
    };

    ////////////////////////////////////////////////////////////////////////////
    // Binary Functions
    ////////////////////////////////////////////////////////////////////////////

    function decToBin(value, numBitsInValue) {
      var mask = 1;
      mask = mask << (numBitsInValue - 1);

      var str = "";
      for (var i = 0; i < numBitsInValue; i++) {
        str += (mask & value) ? "1" : "0";
        mask = mask >>> 1;
      }
      return str;
    }

    /*
      This function does not always work when trying to convert
      colors and bytes to binary values because the types passed in
      cannot be determined.
    */
    p.binary = function(num, numBits) {
      var numBitsInValue = 32;

      // color, int, byte
      if (typeof num === "number") {
        if(numBits){
          numBitsInValue = numBits;
        }
        return decToBin(num, numBitsInValue);
      }

      // char
      if (num instanceof Char) {
        num = num.toString().charCodeAt(0);
        if (numBits) {
          numBitsInValue = 32;
        } else {
          numBitsInValue = 16;
        }
      }

      var str = decToBin(num, numBitsInValue);

      // trim string if user wanted less chars
      if (numBits) {
        str = str.substr(-numBits);
      }
      return str;
    };

    p.unbinary = function unbinary(binaryString) {
      var binaryPattern = new RegExp("^[0|1]{8}$");
      var addUp = 0;
      var i;

      if (binaryString instanceof Array) {
        var values = [];
        for (i = 0; i < binaryString.length; i++) {
          values[i] = p.unbinary(binaryString[i]);
        }
        return values;
      } else {
        if (isNaN(binaryString)) {
          throw "NaN_Err";
        } else {
          if (arguments.length === 1 || binaryString.length === 8) {
            if (binaryPattern.test(binaryString)) {
              for (i = 0; i < 8; i++) {
                addUp += (Math.pow(2, i) * parseInt(binaryString.charAt(7 - i), 10));
              }
              return addUp + "";
            } else {
              throw "notBinary: the value passed into unbinary was not an 8 bit binary number";
            }
          } else {
            throw "longErr";
          }
        }
      }
    };

    function nfCoreScalar(value, plus, minus, leftDigits, rightDigits, group) {
      var sign = (value < 0) ? minus : plus;
      var autoDetectDecimals = rightDigits === 0;
      var rightDigitsOfDefault = (rightDigits === undef || rightDigits < 0) ? 0 : rightDigits;


      // Change the way the number is 'floored' based on whether it is odd or even.
      if (rightDigits < 0 && Math.floor(value) % 2 === 1) {
        // Make sure 1.49 rounds to 1, but 1.5 rounds to 2.
        if ((value - Math.floor(value)) >= 0.5) {
          value += 1;
        }
      }


      var absValue = Math.abs(value);
      if(autoDetectDecimals) {
        rightDigitsOfDefault = 1;
        absValue *= 10;
        while(Math.abs(Math.round(absValue) - absValue) > 1e-6 && rightDigitsOfDefault < 7) {
          ++rightDigitsOfDefault;
          absValue *= 10;
        }
      } else if (rightDigitsOfDefault !== 0) {
        absValue *= Math.pow(10, rightDigitsOfDefault);
      }

      var number = Math.round(absValue);
      var buffer = "";
      var totalDigits = leftDigits + rightDigitsOfDefault;
      while (totalDigits > 0 || number > 0) {
        totalDigits--;
        buffer = "" + (number % 10) + buffer;
        number = Math.floor(number / 10);
      }
      if (group !== undef) {
        var i = buffer.length - 3 - rightDigitsOfDefault;
        while(i > 0) {
          buffer = buffer.substring(0,i) + group + buffer.substring(i);
          i-=3;
        }
      }
      if (rightDigitsOfDefault > 0) {
        return sign + buffer.substring(0, buffer.length - rightDigitsOfDefault) +
               "." + buffer.substring(buffer.length - rightDigitsOfDefault, buffer.length);
      } else {
         return sign + buffer;
      }
    }

    function nfCore(value, plus, minus, leftDigits, rightDigits, group) {
      if (value instanceof Array) {
        var arr = [];
        for (var i = 0, len = value.length; i < len; i++) {
          arr.push(nfCoreScalar(value[i], plus, minus, leftDigits, rightDigits, group));
        }
        return arr;
      } else {
        return nfCoreScalar(value, plus, minus, leftDigits, rightDigits, group);
      }
    }

    // TODO: drop this and use nfCore (see below) code when we've fixed the rounding bug in nfCore
    p.nf = function() {
      var str, num, pad, arr, left, right, isNegative, test, i;

      if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && (arguments[0] + "").indexOf('.') === -1) {
        num = arguments[0];
        pad = arguments[1];

        isNegative = num < 0;

        if (isNegative) {
          num = Math.abs(num);
        }

        str = "" + num;
        for (i = pad - str.length; i > 0; i--) {
          str = "0" + str;
        }

        if (isNegative) {
          str = "-" + str;
        }
      } else if (arguments.length === 2 && typeof arguments[0] === 'object' && arguments[0].constructor === Array && typeof arguments[1] === 'number') {
        arr = arguments[0];
        pad = arguments[1];

        str = new Array(arr.length);

        for (i = 0; i < arr.length && str !== undef; i++) {
          test = p.nf(arr[i], pad);
          if (test === undef) {
            str = undef;
          } else {
            str[i] = test;
          }
        }
      } else if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && typeof arguments[2] === 'number' && (arguments[0] + "").indexOf('.') >= 0) {
        num = arguments[0];
        left = arguments[1];
        right = arguments[2];

        isNegative = num < 0;

        if (isNegative) {
          num = Math.abs(num);
        }

        // Change the way the number is 'floored' based on whether it is odd or even.
        if (right < 0 && Math.floor(num) % 2 === 1) {
          // Make sure 1.49 rounds to 1, but 1.5 rounds to 2.
          if ((num) - Math.floor(num) >= 0.5) {
            num = num + 1;
          }
        }

        str = "" + num;

        for (i = left - str.indexOf('.'); i > 0; i--) {
          str = "0" + str;
        }

        var numDec = str.length - str.indexOf('.') - 1;
        if (numDec <= right) {
          for (i = right - (str.length - str.indexOf('.') - 1); i > 0; i--) {
            str = str + "0";
          }
        } else if (right > 0) {
          str = str.substring(0, str.length - (numDec - right));
        } else if (right < 0) {

          str = str.substring(0, str.indexOf('.'));
        }

        if (isNegative) {
          str = "-" + str;
        }
      } else if (arguments.length === 3 && typeof arguments[0] === 'object' && arguments[0].constructor === Array && typeof arguments[1] === 'number' && typeof arguments[2] === 'number') {
        arr = arguments[0];
        left = arguments[1];
        right = arguments[2];

        str = new Array(arr.length);

        for (i = 0; i < arr.length && str !== undef; i++) {
          test = p.nf(arr[i], left, right);
          if (test === undef) {
            str = undef;
          } else {
            str[i] = test;
          }
        }
      }

      return str;
    };

// TODO: need to switch nf over to using nfCore...
//    p.nf  = function(value, leftDigits, rightDigits) { return nfCore(value, "", "-", leftDigits, rightDigits); };
    p.nfs = function(value, leftDigits, rightDigits) { return nfCore(value, " ", "-", leftDigits, rightDigits); };
    p.nfp = function(value, leftDigits, rightDigits) { return nfCore(value, "+", "-", leftDigits, rightDigits); };
    p.nfc = function(value, leftDigits, rightDigits) { return nfCore(value, "", "-", leftDigits, rightDigits, ","); };

    var decimalToHex = function decimalToHex(d, padding) {
      //if there is no padding value added, default padding to 8 else go into while statement.
      padding = (padding === undef || padding === null) ? padding = 8 : padding;
      if (d < 0) {
        d = 0xFFFFFFFF + d + 1;
      }
      var hex = Number(d).toString(16).toUpperCase();
      while (hex.length < padding) {
        hex = "0" + hex;
      }
      if (hex.length >= padding) {
        hex = hex.substring(hex.length - padding, hex.length);
      }
      return hex;
    };

    // note: since we cannot keep track of byte, int types by default the returned string is 8 chars long
    // if no 2nd argument is passed.  closest compromise we can use to match java implementation Feb 5 2010
    // also the char parser has issues with chars that are not digits or letters IE: !@#$%^&*
    p.hex = function hex(value, len) {
      if (arguments.length === 1) {
        if (value instanceof Char) {
          len = 4;
        } else { // int or byte, indistinguishable at the moment, default to 8
          len = 8;
        }
      }
      return decimalToHex(value, len);
    };

    function unhexScalar(hex) {
      var value = parseInt("0x" + hex, 16);

      // correct for int overflow java expectation
      if (value > 2147483647) {
        value -= 4294967296;
      }
      return value;
    }

    p.unhex = function(hex) {
      if (hex instanceof Array) {
        var arr = [];
        for (var i = 0; i < hex.length; i++) {
          arr.push(unhexScalar(hex[i]));
        }
        return arr;
      } else {
        return unhexScalar(hex);
      }
    };

    // Load a file or URL into strings
    p.loadStrings = function loadStrings(filename) {
      return (localStorage[filename] ? localStorage[filename] : ajax(filename).slice(0, -1)).split("\n");
    };

    // Writes an array of strings to a file, one line per string
    p.saveStrings = function saveStrings(filename, strings) {
      localStorage[filename] = strings.join('\n');
    };

    p.loadBytes = function loadBytes(url, strings) {
      var string = ajax(url);
      var ret = [];

      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }

      return ret;
    };

    ////////////////////////////////////////////////////////////////////////////
    // String Functions
    ////////////////////////////////////////////////////////////////////////////

    p.matchAll = function matchAll(aString, aRegExp) {
      var results = [],
          latest;
      var regexp = new RegExp(aRegExp, "g");
      while ((latest = regexp.exec(aString)) !== null) {
        results.push(latest);
        if (latest[0].length === 0) {
          ++regexp.lastIndex;
        }
      }
      return results.length > 0 ? results : null;
    };

    String.prototype.replaceAll = function(re, replace) {
      return this.replace(new RegExp(re, "g"), replace);
    };

    String.prototype.equals = function equals(str) {
      return this.valueOf() === str.valueOf();
    };

    String.prototype.toCharArray = function() {
      var chars = this.split("");
      for (var i = chars.length - 1; i >= 0; i--) {
        chars[i] = new Char(chars[i]);
      }
      return chars;
    };

    p.match = function(str, regexp) {
      return str.match(regexp);
    };

    // tinylog lite JavaScript library
    // http://purl.eligrey.com/tinylog/lite
    /*global tinylog,print*/
    var tinylogLite = (function() {
      "use strict";

      var tinylogLite = {},
        undef = "undefined",
        func = "function",
        False = !1,
        True = !0,
        logLimit = 512,
        log = "log";

      if (typeof tinylog !== undef && typeof tinylog[log] === func) {
        // pre-existing tinylog present
        tinylogLite[log] = tinylog[log];
      } else if (typeof document !== undef && !document.fake) {
        (function() {
          // DOM document
          var doc = document,

          $div = "div",
          $style = "style",
          $title = "title",

          containerStyles = {
            zIndex: 10000,
            position: "fixed",
            bottom: "0px",
            width: "100%",
            height: "15%",
            fontFamily: "sans-serif",
            color: "#ccc",
            backgroundColor: "black"
          },
          outputStyles = {
            position: "relative",
            fontFamily: "monospace",
            overflow: "auto",
            height: "100%",
            paddingTop: "5px"
          },
          resizerStyles = {
            height: "5px",
            marginTop: "-5px",
            cursor: "n-resize",
            backgroundColor: "darkgrey"
          },
          closeButtonStyles = {
            position: "absolute",
            top: "5px",
            right: "20px",
            color: "#111",
            MozBorderRadius: "4px",
            webkitBorderRadius: "4px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "normal",
            textAlign: "center",
            padding: "3px 5px",
            backgroundColor: "#333",
            fontSize: "12px"
          },
          entryStyles = {
            //borderBottom: "1px solid #d3d3d3",
            minHeight: "16px"
          },
          entryTextStyles = {
            fontSize: "12px",
            margin: "0 8px 0 8px",
            maxWidth: "100%",
            whiteSpace: "pre-wrap",
            overflow: "auto"
          },

          view = doc.defaultView,
            docElem = doc.documentElement,
            docElemStyle = docElem[$style],

          setStyles = function() {
            var i = arguments.length,
              elemStyle, styles, style;

            while (i--) {
              styles = arguments[i--];
              elemStyle = arguments[i][$style];

              for (style in styles) {
                if (styles.hasOwnProperty(style)) {
                  elemStyle[style] = styles[style];
                }
              }
            }
          },

          observer = function(obj, event, handler) {
            if (obj.addEventListener) {
              obj.addEventListener(event, handler, False);
            } else if (obj.attachEvent) {
              obj.attachEvent("on" + event, handler);
            }
            return [obj, event, handler];
          },
          unobserve = function(obj, event, handler) {
            if (obj.removeEventListener) {
              obj.removeEventListener(event, handler, False);
            } else if (obj.detachEvent) {
              obj.detachEvent("on" + event, handler);
            }
          },
          clearChildren = function(node) {
            var children = node.childNodes,
              child = children.length;

            while (child--) {
              node.removeChild(children.item(0));
            }
          },
          append = function(to, elem) {
            return to.appendChild(elem);
          },
          createElement = function(localName) {
            return doc.createElement(localName);
          },
          createTextNode = function(text) {
            return doc.createTextNode(text);
          },

          createLog = tinylogLite[log] = function(message) {
            // don't show output log until called once
            var uninit,
              originalPadding = docElemStyle.paddingBottom,
              container = createElement($div),
              containerStyle = container[$style],
              resizer = append(container, createElement($div)),
              output = append(container, createElement($div)),
              closeButton = append(container, createElement($div)),
              resizingLog = False,
              previousHeight = False,
              previousScrollTop = False,
              messages = 0,

              updateSafetyMargin = function() {
                // have a blank space large enough to fit the output box at the page bottom
                docElemStyle.paddingBottom = container.clientHeight + "px";
              },
              setContainerHeight = function(height) {
                var viewHeight = view.innerHeight,
                  resizerHeight = resizer.clientHeight;

                // constrain the container inside the viewport's dimensions
                if (height < 0) {
                  height = 0;
                } else if (height + resizerHeight > viewHeight) {
                  height = viewHeight - resizerHeight;
                }

                containerStyle.height = height / viewHeight * 100 + "%";

                updateSafetyMargin();
              },
              observers = [
                observer(doc, "mousemove", function(evt) {
                  if (resizingLog) {
                    setContainerHeight(view.innerHeight - evt.clientY);
                    output.scrollTop = previousScrollTop;
                  }
                }),

                observer(doc, "mouseup", function() {
                  if (resizingLog) {
                    resizingLog = previousScrollTop = False;
                  }
                }),

                observer(resizer, "dblclick", function(evt) {
                  evt.preventDefault();

                  if (previousHeight) {
                    setContainerHeight(previousHeight);
                    previousHeight = False;
                  } else {
                    previousHeight = container.clientHeight;
                    containerStyle.height = "0px";
                  }
                }),

                observer(resizer, "mousedown", function(evt) {
                  evt.preventDefault();
                  resizingLog = True;
                  previousScrollTop = output.scrollTop;
                }),

                observer(resizer, "contextmenu", function() {
                  resizingLog = False;
                }),

                observer(closeButton, "click", function() {
                  uninit();
                })
              ];

            uninit = function() {
              // remove observers
              var i = observers.length;

              while (i--) {
                unobserve.apply(tinylogLite, observers[i]);
              }

              // remove tinylog lite from the DOM
              docElem.removeChild(container);
              docElemStyle.paddingBottom = originalPadding;

              clearChildren(output);
              clearChildren(container);

              tinylogLite[log] = createLog;
            };

            setStyles(
            container, containerStyles, output, outputStyles, resizer, resizerStyles, closeButton, closeButtonStyles);

            closeButton[$title] = "Close Log";
            append(closeButton, createTextNode("\u2716"));

            resizer[$title] = "Double-click to toggle log minimization";

            docElem.insertBefore(container, docElem.firstChild);

            tinylogLite[log] = function(message) {
              if (messages === logLimit) {
                output.removeChild(output.firstChild);
              } else {
                messages++;
              }

              var entry = append(output, createElement($div)),
                entryText = append(entry, createElement($div));

              entry[$title] = (new Date()).toLocaleTimeString();

              setStyles(
              entry, entryStyles, entryText, entryTextStyles);

              append(entryText, createTextNode(message));
              output.scrollTop = output.scrollHeight;
            };

            tinylogLite[log](message);
          };
        }());
      } else if (typeof print === func) { // JS shell
        tinylogLite[log] = print;
      }

      return tinylogLite;
    }()),

    logBuffer = [];

    p.console = window.console || tinylogLite;

    p.println = function println(message) {
      var bufferLen = logBuffer.length;
      if (bufferLen) {
        tinylogLite.log(logBuffer.join(""));
        logBuffer.length = 0; // clear log buffer
      }

      if (arguments.length === 0 && bufferLen === 0) {
        tinylogLite.log("");
      } else if (arguments.length !== 0) {
        tinylogLite.log(message);
      }
    };

    p.print = function print(message) {
      logBuffer.push(message);
    };

    // Alphanumeric chars arguments automatically converted to numbers when
    // passed in, and will come out as numbers.
    p.str = function str(val) {
      if (val instanceof Array) {
        var arr = [];
        for (var i = 0; i < val.length; i++) {
          arr.push(val[i] + "");
        }
        return arr;
      } else {
        return (val + "");
      }
    };

    p.trim = function(str) {
      if (str instanceof Array) {
        var arr = [];
        for (var i = 0; i < str.length; i++) {
          arr.push(str[i].replace(/^\s*/, '').replace(/\s*$/, '').replace(/\r*$/, ''));
        }
        return arr;
      } else {
        return str.replace(/^\s*/, '').replace(/\s*$/, '').replace(/\r*$/, '');
      }
    };

    // Conversion
    function booleanScalar(val) {
      if (typeof val === 'number') {
        return val !== 0;
      } else if (typeof val === 'boolean') {
        return val;
      } else if (typeof val === 'string') {
        return val.toLowerCase() === 'true';
      } else if (val instanceof Char) {
        // 1, T or t
        return val.code === 49 || val.code === 84 || val.code === 116;
      }
    }

    p['boolean'] = function(val) {
      if (val instanceof Array) {
        var ret = [];
        for (var i = 0; i < val.length; i++) {
          ret.push(booleanScalar(val[i]));
        }
        return ret;
      } else {
        return booleanScalar(val);
      }
    };

    // a byte is a number between -128 and 127
    p['byte'] = function(aNumber) {
      if (aNumber instanceof Array) {
        var bytes = [];
        for (var i = 0; i < aNumber.length; i++) {
          bytes.push((0 - (aNumber[i] & 0x80)) | (aNumber[i] & 0x7F));
        }
        return bytes;
      } else {
        return (0 - (aNumber & 0x80)) | (aNumber & 0x7F);
      }
    };

    p['char'] = function(key) {
      if (typeof key === "number") {
        return new Char(String.fromCharCode(key & 0xFFFF));
      } else if (key instanceof Array) {
        var ret = [];
        for (var i = 0; i < key.length; i++) {
          ret.push(new Char(String.fromCharCode(key[i] & 0xFFFF)));
        }
        return ret;
      } else {
        throw "char() may receive only one argument of type int, byte, int[], or byte[].";
      }
    };

    // Processing doc claims good argument types are: int, char, byte, boolean,
    // String, int[], char[], byte[], boolean[], String[].
    // floats should not work. However, floats with only zeroes right of the
    // decimal will work because JS converts those to int.
    function floatScalar(val) {
      if (typeof val === 'number') {
        return val;
      } else if (typeof val === 'boolean') {
        return val ? 1 : 0;
      } else if (typeof val === 'string') {
        return parseFloat(val);
      } else if (val instanceof Char) {
        return val.code;
      }
    }

    p['float'] = function(val) {
      if (val instanceof Array) {
        var ret = [];
        for (var i = 0; i < val.length; i++) {
          ret.push(floatScalar(val[i]));
        }
        return ret;
      } else {
        return floatScalar(val);
      }
    };

    function intScalar(val) {
      if (typeof val === 'number') {
        return val & 0xFFFFFFFF;
      } else if (typeof val === 'boolean') {
        return val ? 1 : 0;
      } else if (typeof val === 'string') {
        var number = parseInt(val, 10); // Force decimal radix. Don't convert hex or octal (just like p5)
        return number & 0xFFFFFFFF;
      } else if (val instanceof Char) {
        return val.code;
      }
    }

    p['int'] = function(val) {
      if (val instanceof Array) {
        var ret = [];
        for (var i = 0; i < val.length; i++) {
          if (typeof val[i] === 'string' && !/^\s*[+\-]?\d+\s*$/.test(val[i])) {
            ret.push(0);
          } else {
            ret.push(intScalar(val[i]));
          }
        }
        return ret;
      } else {
        return intScalar(val);
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Math functions
    ////////////////////////////////////////////////////////////////////////////

    // Calculation
    p.abs = Math.abs;

    p.ceil = Math.ceil;

    p.constrain = function(aNumber, aMin, aMax) {
      return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
    };

    p.dist = function() {
      var dx, dy, dz;
      if (arguments.length === 4) {
        dx = arguments[0] - arguments[2];
        dy = arguments[1] - arguments[3];
        return Math.sqrt(dx * dx + dy * dy);
      } else if (arguments.length === 6) {
        dx = arguments[0] - arguments[3];
        dy = arguments[1] - arguments[4];
        dz = arguments[2] - arguments[5];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
    };

    p.exp = Math.exp;

    p.floor = Math.floor;

    p.lerp = function(value1, value2, amt) {
      return ((value2 - value1) * amt) + value1;
    };

    p.log = Math.log;

    p.mag = function(a, b, c) {
      if (arguments.length === 2) {
        return Math.sqrt(a * a + b * b);
      } else if (arguments.length === 3) {
        return Math.sqrt(a * a + b * b + c * c);
      }
    };

    p.map = function(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    };

    p.max = function() {
      if (arguments.length === 2) {
        return arguments[0] < arguments[1] ? arguments[1] : arguments[0];
      } else {
        var numbers = arguments.length === 1 ? arguments[0] : arguments; // if single argument, array is used
        if (! ("length" in numbers && numbers.length > 0)) {
          throw "Non-empty array is expected";
        }
        var max = numbers[0],
          count = numbers.length;
        for (var i = 1; i < count; ++i) {
          if (max < numbers[i]) {
            max = numbers[i];
          }
        }
        return max;
      }
    };

    p.min = function() {
      if (arguments.length === 2) {
        return arguments[0] < arguments[1] ? arguments[0] : arguments[1];
      } else {
        var numbers = arguments.length === 1 ? arguments[0] : arguments; // if single argument, array is used
        if (! ("length" in numbers && numbers.length > 0)) {
          throw "Non-empty array is expected";
        }
        var min = numbers[0],
          count = numbers.length;
        for (var i = 1; i < count; ++i) {
          if (min > numbers[i]) {
            min = numbers[i];
          }
        }
        return min;
      }
    };

    p.norm = function(aNumber, low, high) {
      return (aNumber - low) / (high - low);
    };

    p.pow = Math.pow;

    p.round = Math.round;

    p.sq = function(aNumber) {
      return aNumber * aNumber;
    };

    p.sqrt = Math.sqrt;

    // Trigonometry
    p.acos = Math.acos;

    p.asin = Math.asin;

    p.atan = Math.atan;

    p.atan2 = Math.atan2;

    p.cos = Math.cos;

    p.degrees = function(aAngle) {
      return (aAngle * 180) / Math.PI;
    };

    p.radians = function(aAngle) {
      return (aAngle / 180) * Math.PI;
    };

    p.sin = Math.sin;

    p.tan = Math.tan;

    var currentRandom = Math.random;

    p.random = function random() {
      if(arguments.length === 0) {
        return currentRandom();
      } else if(arguments.length === 1) {
        return currentRandom() * arguments[0];
      } else {
        var aMin = arguments[0], aMax = arguments[1];
        return currentRandom() * (aMax - aMin) + aMin;
      }
    };

    // Pseudo-random generator
    function Marsaglia(i1, i2) {
      // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
      var z=i1 || 362436069, w= i2 || 521288629;
      var nextInt = function() {
        z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
        w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
        return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
      };

      this.nextDouble = function() {
        var i = nextInt() / 4294967296;
        return i < 0 ? 1 + i : i;
      };
      this.nextInt = nextInt;
    }
    Marsaglia.createRandomized = function() {
      var now = new Date();
      return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
    };

    p.randomSeed = function(seed) {
      currentRandom = (new Marsaglia(seed)).nextDouble;
    };

    // Random
    p.Random = function(seed) {
      var haveNextNextGaussian = false, nextNextGaussian, random;

      this.nextGaussian = function() {
        if (haveNextNextGaussian) {
          haveNextNextGaussian = false;
          return nextNextGaussian;
        } else {
          var v1, v2, s;
          do {
            v1 = 2 * random() - 1; // between -1.0 and 1.0
            v2 = 2 * random() - 1; // between -1.0 and 1.0
            s = v1 * v1 + v2 * v2;
          }
          while (s >= 1 || s === 0);

          var multiplier = Math.sqrt(-2 * Math.log(s) / s);
          nextNextGaussian = v2 * multiplier;
          haveNextNextGaussian = true;

          return v1 * multiplier;
        }
      };

      // by default use standard random, otherwise seeded
      random = (seed === undef) ? Math.random : (new Marsaglia(seed)).nextDouble;
    };

    // Noise functions and helpers
    function PerlinNoise(seed) {
      var rnd = seed !== undef ? new Marsaglia(seed) : Marsaglia.createRandomized();
      var i, j;
      // http://www.noisemachine.com/talk1/17b.html
      // http://mrl.nyu.edu/~perlin/noise/
      // generate permutation
      var perm = new Array(512);
      for(i=0;i<256;++i) { perm[i] = i; }
      for(i=0;i<256;++i) { var t = perm[j = rnd.nextInt() & 0xFF]; perm[j] = perm[i]; perm[i] = t; }
      // copy to avoid taking mod in perm[0];
      for(i=0;i<256;++i) { perm[i + 256] = perm[i]; }

      function grad3d(i,x,y,z) {
        var h = i & 15; // convert into 12 gradient directions
        var u = h<8 ? x : y,
            v = h<4 ? y : h===12||h===14 ? x : z;
        return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
      }

      function grad2d(i,x,y) {
        var v = (i & 1) === 0 ? x : y;
        return (i&2) === 0 ? -v : v;
      }

      function grad1d(i,x) {
        return (i&1) === 0 ? -x : x;
      }

      function lerp(t,a,b) { return a + t * (b - a); }

      this.noise3d = function(x, y, z) {
        var X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
        var p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
            p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z;
        return lerp(fz,
          lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
                   lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
          lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
                   lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))));
      };

      this.noise2d = function(x, y) {
        var X = Math.floor(x)&255, Y = Math.floor(y)&255;
        x -= Math.floor(x); y -= Math.floor(y);
        var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y;
        var p0 = perm[X]+Y, p1 = perm[X + 1] + Y;
        return lerp(fy,
          lerp(fx, grad2d(perm[p0], x, y), grad2d(perm[p1], x-1, y)),
          lerp(fx, grad2d(perm[p0 + 1], x, y-1), grad2d(perm[p1 + 1], x-1, y-1)));
      };

      this.noise1d = function(x) {
        var X = Math.floor(x)&255;
        x -= Math.floor(x);
        var fx = (3-2*x)*x*x;
        return lerp(fx, grad1d(perm[X], x), grad1d(perm[X+1], x-1));
      };
    }

    // processing defaults
    var noiseProfile = { generator: undef, octaves: 4, fallout: 0.5, seed: undef};

    p.noise = function(x, y, z) {
      if(noiseProfile.generator === undef) {
        // caching
        noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
      }
      var generator = noiseProfile.generator;
      var effect = 1, k = 1, sum = 0;
      for(var i=0; i<noiseProfile.octaves; ++i) {
        effect *= noiseProfile.fallout;
        switch (arguments.length) {
        case 1:
          sum += effect * (1 + generator.noise1d(k*x))/2; break;
        case 2:
          sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break;
        case 3:
          sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break;
        }
        k *= 2;
      }
      return sum;
    };

    p.noiseDetail = function(octaves, fallout) {
      noiseProfile.octaves = octaves;
      if(fallout !== undef) {
        noiseProfile.fallout = fallout;
      }
    };

    p.noiseSeed = function(seed) {
      noiseProfile.seed = seed;
      noiseProfile.generator = undef;
    };

    // Set default background behavior for 2D and 3D contexts
    var refreshBackground = function() {
      if (!curSketch.options.isTransparent) {
        if (p.use3DContext) {
          // fill background default opaque gray
          curContext.clearColor(204 / 255, 204 / 255, 204 / 255, 1.0);
          curContext.clear(curContext.COLOR_BUFFER_BIT | curContext.DEPTH_BUFFER_BIT);
        } else {
          // fill background default opaque gray
          curContext.fillStyle = "rgb(204, 204, 204)";
          curContext.fillRect(0, 0, p.width, p.height);
          isFillDirty = true;
        }
      }
    };

    // Changes the size of the Canvas ( this resets context properties like 'lineCap', etc.
    p.size = function size(aWidth, aHeight, aMode) {
      if (aMode && (aMode === PConstants.WEBGL)) {
        // get the 3D rendering context
        try {
          // If the HTML <canvas> dimensions differ from the
          // dimensions specified in the size() call in the sketch, for
          // 3D sketches, browsers will either not render or render the
          // scene incorrectly. To fix this, we need to adjust the
          // width and height attributes of the canvas.
          if (curElement.width !== aWidth || curElement.height !== aHeight) {
            curElement.setAttribute("width", aWidth);
            curElement.setAttribute("height", aHeight);
          }
          curContext = curElement.getContext("experimental-webgl");
          p.use3DContext = true;
          canTex = curContext.createTexture(); // texture
        } catch(e_size) {
          Processing.debug(e_size);
        }

        if (!curContext) {
          throw "OPENGL 3D context is not supported on this browser.";
        } else {
          for (var i = 0; i < PConstants.SINCOS_LENGTH; i++) {
            sinLUT[i] = p.sin(i * (PConstants.PI / 180) * 0.5);
            cosLUT[i] = p.cos(i * (PConstants.PI / 180) * 0.5);
          }
          // Set defaults
          curContext.viewport(0, 0, curElement.width, curElement.height);
          curContext.enable(curContext.DEPTH_TEST);
          curContext.enable(curContext.BLEND);
          curContext.blendFunc(curContext.SRC_ALPHA, curContext.ONE_MINUS_SRC_ALPHA);
          refreshBackground(); // sets clearColor default;

          // Create the program objects to render 2D (points, lines) and
          // 3D (spheres, boxes) shapes. Because 2D shapes are not lit,
          // lighting calculations could be ommitted from that program object.
          programObject2D = createProgramObject(curContext, vertexShaderSource2D, fragmentShaderSource2D);

          // set the defaults
          curContext.useProgram(programObject2D);
          p.strokeWeight(1.0);

          programObject3D = createProgramObject(curContext, vertexShaderSource3D, fragmentShaderSource3D);
          programObjectUnlitShape = createProgramObject(curContext, vShaderSrcUnlitShape, fShaderSrcUnlitShape);

          // Now that the programs have been compiled, we can set the default
          // states for the lights.
          curContext.useProgram(programObject3D);

          // assume we aren't using textures by default
          uniformi(programObject3D, "usingTexture", usingTexture);
          p.lightFalloff(1, 0, 0);
          p.shininess(1);
          p.ambient(255, 255, 255);
          p.specular(0, 0, 0);

          // Create buffers for 3D primitives
          boxBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, boxBuffer);
          curContext.bufferData(curContext.ARRAY_BUFFER, boxVerts, curContext.STATIC_DRAW);

          boxNormBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, boxNormBuffer);
          curContext.bufferData(curContext.ARRAY_BUFFER, boxNorms, curContext.STATIC_DRAW);

          boxOutlineBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, boxOutlineBuffer);
          curContext.bufferData(curContext.ARRAY_BUFFER, boxOutlineVerts, curContext.STATIC_DRAW);

          // used to draw the rectangle and the outline
          rectBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, rectBuffer);
          curContext.bufferData(curContext.ARRAY_BUFFER, rectVerts, curContext.STATIC_DRAW);

          rectNormBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, rectNormBuffer);
          curContext.bufferData(curContext.ARRAY_BUFFER, rectNorms, curContext.STATIC_DRAW);

          // The sphere vertices are specified dynamically since the user
          // can change the level of detail. Everytime the user does that
          // using sphereDetail(), the new vertices are calculated.
          sphereBuffer = curContext.createBuffer();

          lineBuffer = curContext.createBuffer();

          // Shape buffers
          fillBuffer = curContext.createBuffer();
          fillColorBuffer = curContext.createBuffer();
          strokeColorBuffer = curContext.createBuffer();
          shapeTexVBO = curContext.createBuffer();

          pointBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, pointBuffer);
          curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array([0, 0, 0]), curContext.STATIC_DRAW);

          textBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, textBuffer );
          curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array([1,1,0,-1,1,0,-1,-1,0,1,-1,0]), curContext.STATIC_DRAW);

          textureBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ARRAY_BUFFER, textureBuffer);
          curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array([0,0,1,0,1,1,0,1]), curContext.STATIC_DRAW);

          indexBuffer = curContext.createBuffer();
          curContext.bindBuffer(curContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
          curContext.bufferData(curContext.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,2,3,0]), curContext.STATIC_DRAW);

          cam = new PMatrix3D();
          cameraInv = new PMatrix3D();
          forwardTransform = new PMatrix3D();
          reverseTransform = new PMatrix3D();
          modelView = new PMatrix3D();
          modelViewInv = new PMatrix3D();
          projection = new PMatrix3D();
          p.camera();
          p.perspective();
          forwardTransform = modelView;
          reverseTransform = modelViewInv;

          userMatrixStack = new PMatrixStack();
          // used by both curve and bezier, so just init here
          curveBasisMatrix = new PMatrix3D();
          curveToBezierMatrix = new PMatrix3D();
          curveDrawMatrix = new PMatrix3D();
          bezierDrawMatrix = new PMatrix3D();
          bezierBasisInverse = new PMatrix3D();
          bezierBasisMatrix = new PMatrix3D();
          bezierBasisMatrix.set(-1, 3, -3, 1, 3, -6, 3, 0, -3, 3, 0, 0, 1, 0, 0, 0);
        }
        p.stroke(0);
        p.fill(255);
      } else {
        if (curContext === undef) {
          // size() was called without p.init() default context, ie. p.createGraphics()
          curContext = curElement.getContext("2d");
          p.use3DContext = false;
          userMatrixStack = new PMatrixStack();
          modelView = new PMatrix2D();
        }
      }

      // The default 2d context has already been created in the p.init() stage if
      // a 3d context was not specified. This is so that a 2d context will be
      // available if size() was not called.
      var props = {
        fillStyle: curContext.fillStyle,
        strokeStyle: curContext.strokeStyle,
        lineCap: curContext.lineCap,
        lineJoin: curContext.lineJoin
      };
      curElement.width = p.width = aWidth || 100;
      curElement.height = p.height = aHeight || 100;

      for (var j in props) {
        if (props) {
          curContext[j] = props[j];
        }
      }

      // redraw the background if background was called before size
      refreshBackground();

      // set 5% for pixels to cache (or 1000)
      maxPixelsCached = Math.max(1000, aWidth * aHeight * 0.05);

      // Externalize the context
      p.externals.context = curContext;

      p.toImageData = function() {
        if(!p.use3DContext){
          return curContext.getImageData(0, 0, this.width, this.height);
        } else {
          var c = document.createElement("canvas");
          var ctx = c.getContext("2d");
          var obj = ctx.createImageData(this.width, this.height);
          var uBuff = new Uint8Array(this.width * this.height * 4);
          curContext.readPixels(0,0,this.width,this.height,curContext.RGBA,curContext.UNSIGNED_BYTE, uBuff);
          for(var i =0; i < uBuff.length; i++){
            obj.data[i] = uBuff[(this.height - 1 - Math.floor(i / 4 / this.width)) * this.width * 4 + (i % (this.width * 4))];
          }

          return obj;
        }
      };
    };

    ////////////////////////////////////////////////////////////////////////////
    // Lights
    ////////////////////////////////////////////////////////////////////////////

    p.ambientLight = function(r, g, b, x, y, z) {
      if (p.use3DContext) {
        if (lightCount === PConstants.MAX_LIGHTS) {
          throw "can only create " + PConstants.MAX_LIGHTS + " lights";
        }

        var pos = new PVector(x, y, z);
        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.mult(pos, pos);

        curContext.useProgram(programObject3D);
        uniformf(programObject3D, "lights[" + lightCount + "].color", [r / 255, g / 255, b / 255]);
        uniformf(programObject3D, "lights[" + lightCount + "].position", pos.array());
        uniformi(programObject3D, "lights[" + lightCount + "].type", 0);
        uniformi(programObject3D, "lightCount", ++lightCount);
      }
    };

    p.directionalLight = function(r, g, b, nx, ny, nz) {
      if (p.use3DContext) {
        if (lightCount === PConstants.MAX_LIGHTS) {
          throw "can only create " + PConstants.MAX_LIGHTS + " lights";
        }

        curContext.useProgram(programObject3D);

        // Less code than manually multiplying, but I'll fix
        // this when I have more time.
        var dir = [nx, ny, nz, 0.0000001];

        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.mult(dir, dir);

        uniformf(programObject3D, "lights[" + lightCount + "].color", [r / 255, g / 255, b / 255]);
        uniformf(programObject3D, "lights[" + lightCount + "].position", [-dir[0], -dir[1], -dir[2]]);
        uniformi(programObject3D, "lights[" + lightCount + "].type", 1);
        uniformi(programObject3D, "lightCount", ++lightCount);
      }
    };

    p.lightFalloff = function lightFalloff(constant, linear, quadratic) {
      if (p.use3DContext) {
        curContext.useProgram(programObject3D);
        uniformf(programObject3D, "falloff", [constant, linear, quadratic]);
      }
    };

    p.lightSpecular = function lightSpecular(r, g, b) {
      if (p.use3DContext) {
        curContext.useProgram(programObject3D);
        uniformf(programObject3D, "specular", [r / 255, g / 255, b / 255]);
      }
    };

    /*
      Sets the default ambient light, directional light,
      falloff, and specular values. P5 Documentation says specular()
      is set, but the code calls lightSpecular().
    */
    p.lights = function lights() {
      p.ambientLight(128, 128, 128);
      p.directionalLight(128, 128, 128, 0, 0, -1);
      p.lightFalloff(1, 0, 0);
      p.lightSpecular(0, 0, 0);
    };

    p.pointLight = function(r, g, b, x, y, z) {
      if (p.use3DContext) {
        if (lightCount === PConstants.MAX_LIGHTS) {
          throw "can only create " + PConstants.MAX_LIGHTS + " lights";
        }

        // place the point in view space once instead of once per vertex
        // in the shader.
        var pos = new PVector(x, y, z);
        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.mult(pos, pos);

        curContext.useProgram(programObject3D);
        uniformf(programObject3D, "lights[" + lightCount + "].color", [r / 255, g / 255, b / 255]);
        uniformf(programObject3D, "lights[" + lightCount + "].position", pos.array());
        uniformi(programObject3D, "lights[" + lightCount + "].type", 2);
        uniformi(programObject3D, "lightCount", ++lightCount);
      }
    };

    /*
      Disables lighting so the all shapes drawn after this
      will not be lit.
    */
    p.noLights = function noLights() {
      if (p.use3DContext) {
        lightCount = 0;
        curContext.useProgram(programObject3D);
        uniformi(programObject3D, "lightCount", lightCount);
      }
    };

    /*
      r,g,b - Color of the light
      x,y,z - position of the light in modeling space
      nx,ny,nz - direction of the spotlight
      angle - in radians
      concentration -
    */
    p.spotLight = function spotLight(r, g, b, x, y, z, nx, ny, nz, angle, concentration) {
      if (p.use3DContext) {
        if (lightCount === PConstants.MAX_LIGHTS) {
          throw "can only create " + PConstants.MAX_LIGHTS + " lights";
        }

        curContext.useProgram(programObject3D);

        // place the point in view space once instead of once per vertex
        // in the shader.
        var pos = new PVector(x, y, z);
        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.mult(pos, pos);

        // transform the spotlight's direction
        // need to find a solution for this one. Maybe manual mult?
        var dir = [nx, ny, nz, 0.0000001];
        view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.mult(dir, dir);

        uniformf(programObject3D, "lights[" + lightCount + "].color", [r / 255, g / 255, b / 255]);
        uniformf(programObject3D, "lights[" + lightCount + "].position", pos.array());
        uniformf(programObject3D, "lights[" + lightCount + "].direction", [dir[0], dir[1], dir[2]]);
        uniformf(programObject3D, "lights[" + lightCount + "].concentration", concentration);
        uniformf(programObject3D, "lights[" + lightCount + "].angle", angle);
        uniformi(programObject3D, "lights[" + lightCount + "].type", 3);
        uniformi(programObject3D, "lightCount", ++lightCount);
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Camera functions
    ////////////////////////////////////////////////////////////////////////////

    p.beginCamera = function beginCamera() {
      if (manipulatingCamera) {
        throw ("You cannot call beginCamera() again before calling endCamera()");
      } else {
        manipulatingCamera = true;
        forwardTransform = cameraInv;
        reverseTransform = cam;
      }
    };

    p.endCamera = function endCamera() {
      if (!manipulatingCamera) {
        throw ("You cannot call endCamera() before calling beginCamera()");
      } else {
        modelView.set(cam);
        modelViewInv.set(cameraInv);
        forwardTransform = modelView;
        reverseTransform = modelViewInv;
        manipulatingCamera = false;
      }
    };

    p.camera = function camera(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
      if (arguments.length === 0) {
        //in case canvas is resized
        cameraX = curElement.width / 2;
        cameraY = curElement.height / 2;
        cameraZ = cameraY / Math.tan(cameraFOV / 2);
        eyeX = cameraX;
        eyeY = cameraY;
        eyeZ = cameraZ;
        centerX = cameraX;
        centerY = cameraY;
        centerZ = 0;
        upX = 0;
        upY = 1;
        upZ = 0;
      }

      var z = new p.PVector(eyeX - centerX, eyeY - centerY, eyeZ - centerZ);
      var y = new p.PVector(upX, upY, upZ);
      var transX, transY, transZ;
      z.normalize();
      var x = p.PVector.cross(y, z);
      y = p.PVector.cross(z, x);
      x.normalize();
      y.normalize();

      cam.set(x.x, x.y, x.z, 0, y.x, y.y, y.z, 0, z.x, z.y, z.z, 0, 0, 0, 0, 1);

      cam.translate(-eyeX, -eyeY, -eyeZ);

      cameraInv.reset();
      cameraInv.invApply(x.x, x.y, x.z, 0, y.x, y.y, y.z, 0, z.x, z.y, z.z, 0, 0, 0, 0, 1);

      cameraInv.translate(eyeX, eyeY, eyeZ);

      modelView.set(cam);
      modelViewInv.set(cameraInv);
    };

    p.perspective = function perspective(fov, aspect, near, far) {
      if (arguments.length === 0) {
        //in case canvas is resized
        cameraY = curElement.height / 2;
        cameraZ = cameraY / Math.tan(cameraFOV / 2);
        cameraNear = cameraZ / 10;
        cameraFar = cameraZ * 10;
        cameraAspect = curElement.width / curElement.height;
        fov = cameraFOV;
        aspect = cameraAspect;
        near = cameraNear;
        far = cameraFar;
      }

      var yMax, yMin, xMax, xMin;
      yMax = near * Math.tan(fov / 2);
      yMin = -yMax;
      xMax = yMax * aspect;
      xMin = yMin * aspect;
      p.frustum(xMin, xMax, yMin, yMax, near, far);
    };

    p.frustum = function frustum(left, right, bottom, top, near, far) {
      frustumMode = true;
      projection = new PMatrix3D();
      projection.set((2 * near) / (right - left), 0, (right + left) / (right - left),
                     0, 0, (2 * near) / (top - bottom), (top + bottom) / (top - bottom),
                     0, 0, 0, -(far + near) / (far - near), -(2 * far * near) / (far - near),
                     0, 0, -1, 0);
    };

    p.ortho = function ortho(left, right, bottom, top, near, far) {
      if (arguments.length === 0) {
        left = 0;
        right = p.width;
        bottom = 0;
        top = p.height;
        near = -10;
        far = 10;
      }

      var x = 2 / (right - left);
      var y = 2 / (top - bottom);
      var z = -2 / (far - near);

      var tx = -(right + left) / (right - left);
      var ty = -(top + bottom) / (top - bottom);
      var tz = -(far + near) / (far - near);

      projection = new PMatrix3D();
      projection.set(x, 0, 0, tx, 0, y, 0, ty, 0, 0, z, tz, 0, 0, 0, 1);

      frustumMode = false;
    };

    p.printProjection = function() {
      projection.print();
    };

    p.printCamera = function() {
      cam.print();
    };

    ////////////////////////////////////////////////////////////////////////////
    // Shapes
    ////////////////////////////////////////////////////////////////////////////

    p.box = function(w, h, d) {
      if (p.use3DContext) {
        // user can uniformly scale the box by
        // passing in only one argument.
        if (!h || !d) {
          h = d = w;
        }

        // Modeling transformation
        var model = new PMatrix3D();
        model.scale(w, h, d);

        // viewing transformation needs to have Y flipped
        // becuase that's what Processing does.
        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.transpose();

        var proj = new PMatrix3D();
        proj.set(projection);
        proj.transpose();

        if (doFill === true) {
          curContext.useProgram(programObject3D);

          disableVertexAttribPointer(programObject3D, "aTexture");

          uniformMatrix(programObject3D, "model", false, model.array());
          uniformMatrix(programObject3D, "view", false, view.array());
          uniformMatrix(programObject3D, "projection", false, proj.array());

          // fix stitching problems. (lines get occluded by triangles
          // since they share the same depth values). This is not entirely
          // working, but it's a start for drawing the outline. So
          // developers can start playing around with styles.
          curContext.enable(curContext.POLYGON_OFFSET_FILL);
          curContext.polygonOffset(1, 1);
          uniformf(programObject3D, "color", fillStyle);

          // Create the normal transformation matrix
          var v = new PMatrix3D();
          v.set(view);

          var m = new PMatrix3D();
          m.set(model);

          v.mult(m);

          var normalMatrix = new PMatrix3D();
          normalMatrix.set(v);
          normalMatrix.invert();
          normalMatrix.transpose();

          uniformMatrix(programObject3D, "normalTransform", false, normalMatrix.array());

          vertexAttribPointer(programObject3D, "Vertex", 3, boxBuffer);
          vertexAttribPointer(programObject3D, "Normal", 3, boxNormBuffer);

          // Ugly hack. Can't simply disable the vertex attribute
          // array. No idea why, so I'm passing in dummy data.
          vertexAttribPointer(programObject3D, "aColor", 3, boxNormBuffer);

          curContext.drawArrays(curContext.TRIANGLES, 0, boxVerts.length / 3);
          curContext.disable(curContext.POLYGON_OFFSET_FILL);
        }

        if (lineWidth > 0 && doStroke) {
          curContext.useProgram(programObject2D);
          uniformMatrix(programObject2D, "model", false, model.array());
          uniformMatrix(programObject2D, "view", false, view.array());
          uniformMatrix(programObject2D, "projection", false, proj.array());

          uniformf(programObject2D, "color", strokeStyle);
          uniformi(programObject2D, "picktype", 0);

          vertexAttribPointer(programObject2D, "Vertex", 3, boxOutlineBuffer);
          disableVertexAttribPointer(programObject2D, "aTextureCoord");

          curContext.lineWidth(lineWidth);
          curContext.drawArrays(curContext.LINES, 0, boxOutlineVerts.length / 3);
        }
      }
    };

    var initSphere = function() {
      var i;
      sphereVerts = [];

      for (i = 0; i < sphereDetailU; i++) {
        sphereVerts.push(0);
        sphereVerts.push(-1);
        sphereVerts.push(0);
        sphereVerts.push(sphereX[i]);
        sphereVerts.push(sphereY[i]);
        sphereVerts.push(sphereZ[i]);
      }
      sphereVerts.push(0);
      sphereVerts.push(-1);
      sphereVerts.push(0);
      sphereVerts.push(sphereX[0]);
      sphereVerts.push(sphereY[0]);
      sphereVerts.push(sphereZ[0]);

      var v1, v11, v2;

      // middle rings
      var voff = 0;
      for (i = 2; i < sphereDetailV; i++) {
        v1 = v11 = voff;
        voff += sphereDetailU;
        v2 = voff;
        for (var j = 0; j < sphereDetailU; j++) {
          sphereVerts.push(parseFloat(sphereX[v1]));
          sphereVerts.push(parseFloat(sphereY[v1]));
          sphereVerts.push(parseFloat(sphereZ[v1++]));
          sphereVerts.push(parseFloat(sphereX[v2]));
          sphereVerts.push(parseFloat(sphereY[v2]));
          sphereVerts.push(parseFloat(sphereZ[v2++]));
        }

        // close each ring
        v1 = v11;
        v2 = voff;

        sphereVerts.push(parseFloat(sphereX[v1]));
        sphereVerts.push(parseFloat(sphereY[v1]));
        sphereVerts.push(parseFloat(sphereZ[v1]));
        sphereVerts.push(parseFloat(sphereX[v2]));
        sphereVerts.push(parseFloat(sphereY[v2]));
        sphereVerts.push(parseFloat(sphereZ[v2]));
      }

      // add the northern cap
      for (i = 0; i < sphereDetailU; i++) {
        v2 = voff + i;

        sphereVerts.push(parseFloat(sphereX[v2]));
        sphereVerts.push(parseFloat(sphereY[v2]));
        sphereVerts.push(parseFloat(sphereZ[v2]));
        sphereVerts.push(0);
        sphereVerts.push(1);
        sphereVerts.push(0);
      }

      sphereVerts.push(parseFloat(sphereX[voff]));
      sphereVerts.push(parseFloat(sphereY[voff]));
      sphereVerts.push(parseFloat(sphereZ[voff]));
      sphereVerts.push(0);
      sphereVerts.push(1);
      sphereVerts.push(0);

      //set the buffer data
      curContext.bindBuffer(curContext.ARRAY_BUFFER, sphereBuffer);
      curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(sphereVerts), curContext.STATIC_DRAW);
    };

    p.sphereDetail = function sphereDetail(ures, vres) {
      var i;

      if (arguments.length === 1) {
        ures = vres = arguments[0];
      }

      if (ures < 3) {
        ures = 3;
      } // force a minimum res
      if (vres < 2) {
        vres = 2;
      } // force a minimum res
      // if it hasn't changed do nothing
      if ((ures === sphereDetailU) && (vres === sphereDetailV)) {
        return;
      }

      var delta = PConstants.SINCOS_LENGTH / ures;
      var cx = new Array(ures);
      var cz = new Array(ures);
      // calc unit circle in XZ plane
      for (i = 0; i < ures; i++) {
        cx[i] = cosLUT[parseInt((i * delta) % PConstants.SINCOS_LENGTH, 10)];
        cz[i] = sinLUT[parseInt((i * delta) % PConstants.SINCOS_LENGTH, 10)];
      }

      // computing vertexlist
      // vertexlist starts at south pole
      var vertCount = ures * (vres - 1) + 2;
      var currVert = 0;

      // re-init arrays to store vertices
      sphereX = new Array(vertCount);
      sphereY = new Array(vertCount);
      sphereZ = new Array(vertCount);

      var angle_step = (PConstants.SINCOS_LENGTH * 0.5) / vres;
      var angle = angle_step;

      // step along Y axis
      for (i = 1; i < vres; i++) {
        var curradius = sinLUT[parseInt(angle % PConstants.SINCOS_LENGTH, 10)];
        var currY = -cosLUT[parseInt(angle % PConstants.SINCOS_LENGTH, 10)];
        for (var j = 0; j < ures; j++) {
          sphereX[currVert] = cx[j] * curradius;
          sphereY[currVert] = currY;
          sphereZ[currVert++] = cz[j] * curradius;
        }
        angle += angle_step;
      }
      sphereDetailU = ures;
      sphereDetailV = vres;

      // make the sphere verts and norms
      initSphere();
    };

    p.sphere = function() {
      if (p.use3DContext) {
        var sRad = arguments[0], c;

        if ((sphereDetailU < 3) || (sphereDetailV < 2)) {
          p.sphereDetail(30);
        }

        // Modeling transformation
        var model = new PMatrix3D();
        model.scale(sRad, sRad, sRad);

        // viewing transformation needs to have Y flipped
        // becuase that's what Processing does.
        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.transpose();

        var proj = new PMatrix3D();
        proj.set(projection);
        proj.transpose();

        if (doFill === true) {
          // Create a normal transformation matrix
          var v = new PMatrix3D();
          v.set(view);

          var m = new PMatrix3D();
          m.set(model);

          v.mult(m);

          var normalMatrix = new PMatrix3D();
          normalMatrix.set(v);
          normalMatrix.invert();
          normalMatrix.transpose();

          curContext.useProgram(programObject3D);
          disableVertexAttribPointer(programObject3D, "aTexture");

          uniformMatrix(programObject3D, "model", false, model.array());
          uniformMatrix(programObject3D, "view", false, view.array());
          uniformMatrix(programObject3D, "projection", false, proj.array());
          uniformMatrix(programObject3D, "normalTransform", false, normalMatrix.array());

          vertexAttribPointer(programObject3D, "Vertex", 3, sphereBuffer);
          vertexAttribPointer(programObject3D, "Normal", 3, sphereBuffer);

          // Ugly hack. Can't simply disable the vertex attribute
          // array. No idea why, so I'm passing in dummy data.
          vertexAttribPointer(programObject3D, "aColor", 3, sphereBuffer);

          // fix stitching problems. (lines get occluded by triangles
          // since they share the same depth values). This is not entirely
          // working, but it's a start for drawing the outline. So
          // developers can start playing around with styles.
          curContext.enable(curContext.POLYGON_OFFSET_FILL);
          curContext.polygonOffset(1, 1);

          uniformf(programObject3D, "color", fillStyle);

          curContext.drawArrays(curContext.TRIANGLE_STRIP, 0, sphereVerts.length / 3);
          curContext.disable(curContext.POLYGON_OFFSET_FILL);
        }

        if (lineWidth > 0 && doStroke) {
          curContext.useProgram(programObject2D);
          uniformMatrix(programObject2D, "model", false, model.array());
          uniformMatrix(programObject2D, "view", false, view.array());
          uniformMatrix(programObject2D, "projection", false, proj.array());

          vertexAttribPointer(programObject2D, "Vertex", 3, sphereBuffer);
          disableVertexAttribPointer(programObject2D, "aTextureCoord");

          uniformf(programObject2D, "color", strokeStyle);
          uniformi(programObject2D, "picktype", 0);

          curContext.lineWidth(lineWidth);
          curContext.drawArrays(curContext.LINE_STRIP, 0, sphereVerts.length / 3);
        }
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Coordinates
    ////////////////////////////////////////////////////////////////////////////

    p.modelX = function modelX(x, y, z) {
      var mv = modelView.array();
      var ci = cameraInv.array();

      var ax = mv[0] * x + mv[1] * y + mv[2] * z + mv[3];
      var ay = mv[4] * x + mv[5] * y + mv[6] * z + mv[7];
      var az = mv[8] * x + mv[9] * y + mv[10] * z + mv[11];
      var aw = mv[12] * x + mv[13] * y + mv[14] * z + mv[15];

      var ox = ci[0] * ax + ci[1] * ay + ci[2] * az + ci[3] * aw;
      var ow = ci[12] * ax + ci[13] * ay + ci[14] * az + ci[15] * aw;

      return (ow !== 0) ? ox / ow : ox;
    };

    p.modelY = function modelY(x, y, z) {
      var mv = modelView.array();
      var ci = cameraInv.array();

      var ax = mv[0] * x + mv[1] * y + mv[2] * z + mv[3];
      var ay = mv[4] * x + mv[5] * y + mv[6] * z + mv[7];
      var az = mv[8] * x + mv[9] * y + mv[10] * z + mv[11];
      var aw = mv[12] * x + mv[13] * y + mv[14] * z + mv[15];

      var oy = ci[4] * ax + ci[5] * ay + ci[6] * az + ci[7] * aw;
      var ow = ci[12] * ax + ci[13] * ay + ci[14] * az + ci[15] * aw;

      return (ow !== 0) ? oy / ow : oy;
    };

    p.modelZ = function modelZ(x, y, z) {
      var mv = modelView.array();
      var ci = cameraInv.array();

      var ax = mv[0] * x + mv[1] * y + mv[2] * z + mv[3];
      var ay = mv[4] * x + mv[5] * y + mv[6] * z + mv[7];
      var az = mv[8] * x + mv[9] * y + mv[10] * z + mv[11];
      var aw = mv[12] * x + mv[13] * y + mv[14] * z + mv[15];

      var oz = ci[8] * ax + ci[9] * ay + ci[10] * az + ci[11] * aw;
      var ow = ci[12] * ax + ci[13] * ay + ci[14] * az + ci[15] * aw;

      return (ow !== 0) ? oz / ow : oz;
    };

    ////////////////////////////////////////////////////////////////////////////
    // Material Properties
    ////////////////////////////////////////////////////////////////////////////

    p.ambient = function ambient() {
      // create an alias to shorten code
      var a = arguments;

      // either a shade of gray or a 'color' object.
      if (p.use3DContext) {
        curContext.useProgram(programObject3D);
        uniformi(programObject3D, "usingMat", true);

        if (a.length === 1) {
          // color object was passed in
          if (typeof a[0] === "string") {
            var c = a[0].slice(5, -1).split(",");
            uniformf(programObject3D, "mat_ambient", [c[0] / 255, c[1] / 255, c[2] / 255]);
          }
          // else a single number was passed in for gray shade
          else {
            uniformf(programObject3D, "mat_ambient", [a[0] / 255, a[0] / 255, a[0] / 255]);
          }
        }
        // Otherwise three values were provided (r,g,b)
        else {
          uniformf(programObject3D, "mat_ambient", [a[0] / 255, a[1] / 255, a[2] / 255]);
        }
      }
    };

    p.emissive = function emissive() {
      // create an alias to shorten code
      var a = arguments;

      if (p.use3DContext) {
        curContext.useProgram(programObject3D);
        uniformi(programObject3D, "usingMat", true);

        // If only one argument was provided, the user either gave us a
        // shade of gray or a 'color' object.
        if (a.length === 1) {
          // color object was passed in
          if (typeof a[0] === "string") {
            var c = a[0].slice(5, -1).split(",");
            uniformf(programObject3D, "mat_emissive", [c[0] / 255, c[1] / 255, c[2] / 255]);
          }
          // else a regular number was passed in for gray shade
          else {
            uniformf(programObject3D, "mat_emissive", [a[0] / 255, a[0] / 255, a[0] / 255]);
          }
        }
        // Otherwise three values were provided (r,g,b)
        else {
          uniformf(programObject3D, "mat_emissive", [a[0] / 255, a[1] / 255, a[2] / 255]);
        }
      }
    };

    p.shininess = function shininess(shine) {
      if (p.use3DContext) {
        curContext.useProgram(programObject3D);
        uniformi(programObject3D, "usingMat", true);
        uniformf(programObject3D, "shininess", shine);
      }
    };

    /*
      Documentation says the following calls are valid, but the
      Processing throws exceptions:
      specular(gray, alpha)
      specular(v1, v2, v3, alpha)
      So we don't support them either
      <corban> I dont think this matters so much, let us let color handle it. alpha values are not sent anyways.
    */
    p.specular = function specular() {
      var c = p.color.apply(this, arguments);

      if (p.use3DContext) {
        curContext.useProgram(programObject3D);
        uniformi(programObject3D, "usingMat", true);
        uniformf(programObject3D, "mat_specular", p.color.toGLArray(c).slice(0, 3));
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Coordinates
    ////////////////////////////////////////////////////////////////////////////
    p.screenX = function screenX( x, y, z ) {
      var mv = modelView.array();
      var pj = projection.array();

      var ax = mv[ 0]*x + mv[ 1]*y + mv[ 2]*z + mv[ 3];
      var ay = mv[ 4]*x + mv[ 5]*y + mv[ 6]*z + mv[ 7];
      var az = mv[ 8]*x + mv[ 9]*y + mv[10]*z + mv[11];
      var aw = mv[12]*x + mv[13]*y + mv[14]*z + mv[15];

      var ox = pj[ 0]*ax + pj[ 1]*ay + pj[ 2]*az + pj[ 3]*aw;
      var ow = pj[12]*ax + pj[13]*ay + pj[14]*az + pj[15]*aw;

      if ( ow !== 0 ){
        ox /= ow;
      }
      return p.width * ( 1 + ox ) / 2.0;
    };

    p.screenY = function screenY( x, y, z ) {
      var mv = modelView.array();
      var pj = projection.array();

      var ax = mv[ 0]*x + mv[ 1]*y + mv[ 2]*z + mv[ 3];
      var ay = mv[ 4]*x + mv[ 5]*y + mv[ 6]*z + mv[ 7];
      var az = mv[ 8]*x + mv[ 9]*y + mv[10]*z + mv[11];
      var aw = mv[12]*x + mv[13]*y + mv[14]*z + mv[15];

      var oy = pj[ 4]*ax + pj[ 5]*ay + pj[ 6]*az + pj[ 7]*aw;
      var ow = pj[12]*ax + pj[13]*ay + pj[14]*az + pj[15]*aw;

      if ( ow !== 0 ){
        oy /= ow;
      }
      return p.height * ( 1 + oy ) / 2.0;
    };

    p.screenZ = function screenZ( x, y, z ) {
      var mv = modelView.array();
      var pj = projection.array();

      var ax = mv[ 0]*x + mv[ 1]*y + mv[ 2]*z + mv[ 3];
      var ay = mv[ 4]*x + mv[ 5]*y + mv[ 6]*z + mv[ 7];
      var az = mv[ 8]*x + mv[ 9]*y + mv[10]*z + mv[11];
      var aw = mv[12]*x + mv[13]*y + mv[14]*z + mv[15];

      var oz = pj[ 8]*ax + pj[ 9]*ay + pj[10]*az + pj[11]*aw;
      var ow = pj[12]*ax + pj[13]*ay + pj[14]*az + pj[15]*aw;

      if ( ow !== 0 ) {
        oz /= ow;
      }
      return ( oz + 1 ) / 2.0;
    };

    ////////////////////////////////////////////////////////////////////////////
    // Style functions
    ////////////////////////////////////////////////////////////////////////////

    p.fill = function fill() {
      var color = p.color(arguments[0], arguments[1], arguments[2], arguments[3]);
      if(color === currentFillColor && doFill) {
        return;
      }
      doFill = true;
      currentFillColor = color;

      if (p.use3DContext) {
        fillStyle = p.color.toGLArray(color);
      } else {
        isFillDirty = true;
      }
    };

    function executeContextFill() {
      if(doFill) {
        if(isFillDirty) {
          curContext.fillStyle = p.color.toString(currentFillColor);
          isFillDirty = false;
        }
        curContext.fill();
      }
    }

    p.noFill = function noFill() {
      doFill = false;
    };

    p.stroke = function stroke() {
      var color = p.color(arguments[0], arguments[1], arguments[2], arguments[3]);
      if(color === currentStrokeColor && doStroke) {
        return;
      }
      doStroke = true;
      currentStrokeColor = color;

      if (p.use3DContext) {
        strokeStyle = p.color.toGLArray(color);
      } else {
        isStrokeDirty = true;
      }
    };

    function executeContextStroke() {
      if(doStroke) {
        if(isStrokeDirty) {
          curContext.strokeStyle = p.color.toString(currentStrokeColor);
          isStrokeDirty = false;
        }
        curContext.stroke();
      }
    }

    p.noStroke = function noStroke() {
      doStroke = false;
    };

    p.strokeWeight = function strokeWeight(w) {
      lineWidth = w;

      if (p.use3DContext) {
        curContext.useProgram(programObject2D);
        uniformf(programObject2D, "pointSize", w);
      } else {
        curContext.lineWidth = w;
      }
    };

    p.strokeCap = function strokeCap(value) {
      curContext.lineCap = value;
    };

    p.strokeJoin = function strokeJoin(value) {
      curContext.lineJoin = value;
    };

    p.smooth = function() {
      curElement.style.setProperty("image-rendering", "optimizeQuality", "important");
      if (!p.use3DContext && "mozImageSmoothingEnabled" in curContext) {
        curContext.mozImageSmoothingEnabled = true;
      }
    };

    p.noSmooth = function() {
      curElement.style.setProperty("image-rendering", "optimizeSpeed", "important");
      if (!p.use3DContext && "mozImageSmoothingEnabled" in curContext) {
        curContext.mozImageSmoothingEnabled = false;
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Vector drawing functions
    ////////////////////////////////////////////////////////////////////////////

    function colorBlendWithAlpha(c1, c2, k) {
        var f = 0|(k * ((c2 & PConstants.ALPHA_MASK) >>> 24));
        return (Math.min(((c1 & PConstants.ALPHA_MASK) >>> 24) + f, 0xff) << 24 |
                p.mix(c1 & PConstants.RED_MASK, c2 & PConstants.RED_MASK, f) & PConstants.RED_MASK |
                p.mix(c1 & PConstants.GREEN_MASK, c2 & PConstants.GREEN_MASK, f) & PConstants.GREEN_MASK |
                p.mix(c1 & PConstants.BLUE_MASK, c2 & PConstants.BLUE_MASK, f));
    }

    p.point = function point(x, y, z) {
      if (p.use3DContext) {
        var model = new PMatrix3D();

        // move point to position
        model.translate(x, y, z || 0);
        model.transpose();

        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.transpose();

        var proj = new PMatrix3D();
        proj.set(projection);
        proj.transpose();

        curContext.useProgram(programObject2D);
        uniformMatrix(programObject2D, "model", false, model.array());
        uniformMatrix(programObject2D, "view", false, view.array());
        uniformMatrix(programObject2D, "projection", false, proj.array());

        if (lineWidth > 0 && doStroke) {
          // this will be replaced with the new bit shifting color code
          uniformf(programObject2D, "color", strokeStyle);
          uniformi(programObject2D, "picktype", 0);

          vertexAttribPointer(programObject2D, "Vertex", 3, pointBuffer);
          disableVertexAttribPointer(programObject2D, "aTextureCoord");

          curContext.drawArrays(curContext.POINTS, 0, 1);
        }
      } else {
        if (doStroke) {
          // TODO if strokeWeight > 1, do circle

          if (curSketch.options.crispLines) {
            var alphaOfPointWeight = Math.PI / 4;  // TODO dependency of strokeWeight
            var c = p.get(x, y);
            p.set(x, y, colorBlendWithAlpha(c, currentStrokeColor, alphaOfPointWeight));
          } else {
            if (lineWidth > 1){
              curContext.fillStyle = p.color.toString(currentStrokeColor);
              isFillDirty = true;
              curContext.beginPath();
              curContext.arc(x, y, lineWidth / 2, 0, PConstants.TWO_PI, false);
              curContext.fill();
              curContext.closePath();
            } else {
              curContext.fillStyle = p.color.toString(currentStrokeColor);
              curContext.fillRect(Math.round(x), Math.round(y), 1, 1);
              isFillDirty = true;
            }
          }
        }
      }
    };

    p.beginShape = function beginShape(type) {
      curShape = type;
      curShapeCount = 0;
      curvePoints = [];
      //textureImage = null;
      vertArray = [];
      if(p.use3DContext)
      {
        //normalMode = NORMAL_MODE_AUTO;
      }
    };

    p.vertex = function vertex() {
      var vert = [];

      if (firstVert) { firstVert = false; }

      if (arguments.length === 4) { //x, y, u, v
        vert[0] = arguments[0];
        vert[1] = arguments[1];
        vert[2] = 0;
        vert[3] = arguments[2];
        vert[4] = arguments[3];
      } else { // x, y, z, u, v
        vert[0] = arguments[0];
        vert[1] = arguments[1];
        vert[2] = arguments[2] || 0;
        vert[3] = arguments[3] || 0;
        vert[4] = arguments[4] || 0;
      }

      vert["isVert"] =  true;

      if (p.use3DContext) {
        // fill rgba
        vert[5] = fillStyle[0];
        vert[6] = fillStyle[1];
        vert[7] = fillStyle[2];
        vert[8] = fillStyle[3];
        // stroke rgba
        vert[9] = strokeStyle[0];
        vert[10] = strokeStyle[1];
        vert[11] = strokeStyle[2];
        vert[12] = strokeStyle[3];
        //normals
        vert[13] = normalX;
        vert[14] = normalY;
        vert[15] = normalZ;
      } else {
        // fill and stroke color
        vert[5] = currentFillColor;
        vert[6] = currentStrokeColor;
      }

      vertArray.push(vert);
    };

    /*
      Draw 3D points created from calls to vertex:

      beginShape(POINT);
      vertex(x, y, 0);
      ...
      endShape();
    */
    var point3D = function point3D(vArray, cArray){
      var view = new PMatrix3D();
      view.scale(1, -1, 1);
      view.apply(modelView.array());
      view.transpose();

      var proj = new PMatrix3D();
      proj.set(projection);
      proj.transpose();

      curContext.useProgram(programObjectUnlitShape);
      uniformMatrix(programObjectUnlitShape, "uView", false, view.array());
      uniformMatrix(programObjectUnlitShape, "uProjection", false, proj.array());

      vertexAttribPointer(programObjectUnlitShape, "aVertex", 3, pointBuffer);
      curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(vArray), curContext.STREAM_DRAW);

      vertexAttribPointer(programObjectUnlitShape, "aColor", 4, fillColorBuffer);
      curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(cArray), curContext.STREAM_DRAW);

      curContext.drawArrays(curContext.POINTS, 0, vArray.length/3);
    };

    /*
      Draw 3D lines created from calls to beginShape/vertex/endShape
      LINES, LINE_LOOP, etc.
    */
    var line3D = function line3D(vArray, mode, cArray){
      var ctxMode;
      if (mode === "LINES"){
        ctxMode = curContext.LINES;
      }
      else if(mode === "LINE_LOOP"){
        ctxMode = curContext.LINE_LOOP;
      }
      else{
        ctxMode = curContext.LINE_STRIP;
      }

      var view = new PMatrix3D();
      view.scale(1, -1, 1);
      view.apply(modelView.array());
      view.transpose();

      var proj = new PMatrix3D();
      proj.set(projection);
      proj.transpose();

      curContext.useProgram(programObjectUnlitShape);
      uniformMatrix(programObjectUnlitShape, "uView", false, view.array());
      uniformMatrix(programObjectUnlitShape, "uProjection", false, proj.array());

      vertexAttribPointer(programObjectUnlitShape, "aVertex", 3, lineBuffer);
      curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(vArray), curContext.STREAM_DRAW);

      vertexAttribPointer(programObjectUnlitShape, "aColor", 4, strokeColorBuffer);
      curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(cArray), curContext.STREAM_DRAW);

      curContext.lineWidth(lineWidth);

      curContext.drawArrays(ctxMode, 0, vArray.length/3);
    };

    var fill3D = function fill3D(vArray, mode, cArray, tArray){
      var ctxMode;
      if(mode === "TRIANGLES"){
        ctxMode = curContext.TRIANGLES;
      }
      else if(mode === "TRIANGLE_FAN"){
        ctxMode = curContext.TRIANGLE_FAN;
      }
      else{
        ctxMode = curContext.TRIANGLE_STRIP;
      }

      var view = new PMatrix3D();
      view.scale(1, -1, 1);
      view.apply(modelView.array());
      view.transpose();

      var proj = new PMatrix3D();
      proj.set(projection);
      proj.transpose();

      curContext.useProgram( programObject3D );
      uniformMatrix( programObject3D, "model", false,  [1,0,0,0,  0,1,0,0,   0,0,1,0,   0,0,0,1] );
      uniformMatrix( programObject3D, "view", false, view.array() );
      uniformMatrix( programObject3D, "projection", false, proj.array() );

      curContext.enable( curContext.POLYGON_OFFSET_FILL );
      curContext.polygonOffset( 1, 1 );

      uniformf(programObject3D, "color", [-1,0,0,0]);

      vertexAttribPointer(programObject3D, "Vertex", 3, fillBuffer);
      curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(vArray), curContext.STREAM_DRAW);

      vertexAttribPointer(programObject3D, "aColor", 4, fillColorBuffer);
      curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(cArray), curContext.STREAM_DRAW);

      // No support for lights....yet
      disableVertexAttribPointer(programObject3D, "Normal");

      var i;

      if(usingTexture){
        if(curTextureMode === PConstants.IMAGE){
          for(i = 0; i < tArray.length; i += 2){
            tArray[i] = tArray[i]/curTexture.width;
            tArray[i+1] /= curTexture.height;
          }
        }

        // hack to handle when users specifies values
        // greater than 1.0 for texture coords.
        for(i = 0; i < tArray.length; i += 2){
          if( tArray[i+0] > 1.0 ){ tArray[i+0] -= (tArray[i+0] - 1.0);}
          if( tArray[i+1] > 1.0 ){ tArray[i+1] -= (tArray[i+1] - 1.0);}
        }

        uniformi(programObject3D, "usingTexture", usingTexture);
        vertexAttribPointer(programObject3D, "aTexture", 2, shapeTexVBO);
        curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(tArray), curContext.STREAM_DRAW);
      }

      curContext.drawArrays( ctxMode, 0, vArray.length/3 );
      curContext.disable( curContext.POLYGON_OFFSET_FILL );
    };

    p.endShape = function endShape(mode){
      var closeShape = mode === PConstants.CLOSE;
      var lineVertArray = [];
      var fillVertArray = [];
      var colorVertArray = [];
      var strokeVertArray = [];
      var texVertArray = [];

      firstVert = true;
      var i, j, k;
      var last = vertArray.length - 1;

      for (i = 0; i < vertArray.length; i++) {
        for (j = 0; j < 3; j++) {
          fillVertArray.push(vertArray[i][j]);
        }
      }

      // 5,6,7,8
      // R,G,B,A
      for (i = 0; i < vertArray.length; i++) {
        for (j = 5; j < 9; j++) {
          colorVertArray.push(vertArray[i][j]);
        }
      }

      // 9,10,11,12
      // R, G, B, A
      for (i = 0; i < vertArray.length; i++) {
        for (j = 9; j < 13; j++) {
          strokeVertArray.push(vertArray[i][j]);
        }
      }

      for (i = 0; i < vertArray.length; i++) {
        texVertArray.push(vertArray[i][3]);
        texVertArray.push(vertArray[i][4]);
      }

      if (closeShape) {
        fillVertArray.push(vertArray[0][0]);
        fillVertArray.push(vertArray[0][1]);
        fillVertArray.push(vertArray[0][2]);

        for (i = 5; i < 9; i++) {
          colorVertArray.push(vertArray[0][i]);
        }

       for (i = 9; i < 13; i++) {
          strokeVertArray.push(vertArray[0][i]);
        }

        texVertArray.push(vertArray[0][3]);
        texVertArray.push(vertArray[0][4]);
      }

      if (isCurve && curShape === PConstants.POLYGON || isCurve && curShape === undef) {
        if (p.use3DContext) {
          lineVertArray = fillVertArray;
          if (doStroke) {
            line3D(lineVertArray, null, strokeVertArray);
          }
          if (doFill) {
            fill3D(fillVertArray, null, colorVertArray); // fill isn't working in 3d curveVertex
          }
        } else {
          if (vertArray.length > 3) {
            var b = [],
                s = 1 - curTightness;
            curContext.beginPath();
            curContext.moveTo(vertArray[1][0], vertArray[1][1]);
              /*
              * Matrix to convert from Catmull-Rom to cubic Bezier
              * where t = curTightness
              * |0         1          0         0       |
              * |(t-1)/6   1          (1-t)/6   0       |
              * |0         (1-t)/6    1         (t-1)/6 |
              * |0         0          0         0       |
              */
            for (i = 1; (i+2) < vertArray.length; i++) {
              b[0] = [vertArray[i][0], vertArray[i][1]];
              b[1] = [vertArray[i][0] + (s * vertArray[i+1][0] - s * vertArray[i-1][0]) / 6,
                     vertArray[i][1] + (s * vertArray[i+1][1] - s * vertArray[i-1][1]) / 6];
              b[2] = [vertArray[i+1][0] + (s * vertArray[i][0] - s * vertArray[i+2][0]) / 6,
                     vertArray[i+1][1] + (s * vertArray[i][1] - s * vertArray[i+2][1]) / 6];
              b[3] = [vertArray[i+1][0], vertArray[i+1][1]];
              curContext.bezierCurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
            }
            // close the shape
            if (closeShape) {
              curContext.lineTo(vertArray[0][0], vertArray[0][1]);
            }
            executeContextFill();
            executeContextStroke();
            curContext.closePath();
          }
        }
      } else if (isBezier && curShape === PConstants.POLYGON || isBezier && curShape === undef) {
        if (p.use3DContext) {
          lineVertArray = fillVertArray;
          lineVertArray.splice(lineVertArray.length - 3);
          strokeVertArray.splice(strokeVertArray.length - 4);
          if (doStroke) {
            line3D(lineVertArray, null, strokeVertArray);
          }
          if (doFill) {
            fill3D(fillVertArray, "TRIANGLES", colorVertArray);
          }

          // TODO: Fill not properly working yet, will fix later
          /*fillVertArray = [];
          colorVertArray = [];
          tempArray.reverse();
          for(i = 0; (i+1) < 10; i++){
            for(j = 0; j < 3; j++){
              fillVertArray.push(tempArray[i][j]);
            }
            for(j = 5; j < 9; j++){
              colorVertArray.push(tempArray[i][j]);
            }
            for(j = 0; j < 3; j++){
              fillVertArray.push(vertArray[i][j]);
            }
            for(j = 5; j < 9; j++){
              colorVertArray.push(vertArray[i][j]);
            }
            for(j = 0; j < 3; j++){
              fillVertArray.push(vertArray[i+1][j]);
            }
            for(j = 5; j < 9; j++){
              colorVertArray.push(vertArray[i][j]);
            }
          }

          strokeVertArray = [];
          for(i = 0; i < tempArray.length/3; i++){
            strokeVertArray.push(255);
            strokeVertArray.push(0);
            strokeVertArray.push(0);
            strokeVertArray.push(255);
          }
          point3D(tempArray, strokeVertArray);*/
        } else {
          curContext.beginPath();
          for (i = 0; i < vertArray.length; i++) {
            if (vertArray[i]["isVert"] === true) { //if it is a vertex move to the position
              if (vertArray[i]["moveTo"] === true) {
                curContext.moveTo(vertArray[i][0], vertArray[i][1]);
              } else if (vertArray[i]["moveTo"] === false){
                curContext.lineTo(vertArray[i][0], vertArray[i][1]);
              } else {
                curContext.moveTo(vertArray[i][0], vertArray[i][1]);
              }
            } else { //otherwise continue drawing bezier
              curContext.bezierCurveTo(vertArray[i][0], vertArray[i][1], vertArray[i][2], vertArray[i][3], vertArray[i][4], vertArray[i][5]);
            }
          }
          // close the shape
          if (closeShape) {
            curContext.lineTo(vertArray[0][0], vertArray[0][1]);
          }
          executeContextFill();
          executeContextStroke();
          curContext.closePath();
        }
      } else {
        if (p.use3DContext) { // 3D context
          if (curShape === PConstants.POINTS) {
            for (i = 0; i < vertArray.length; i++) {
              for (j = 0; j < 3; j++) {
                lineVertArray.push(vertArray[i][j]);
              }
            }
            point3D(lineVertArray, strokeVertArray);
          } else if (curShape === PConstants.LINES) {
            for (i = 0; i < vertArray.length; i++) {
              for (j = 0; j < 3; j++) {
                lineVertArray.push(vertArray[i][j]);
              }
            }
            for (i = 0; i < vertArray.length; i++) {
              for (j = 5; j < 9; j++) {
                colorVertArray.push(vertArray[i][j]);
              }
            }
            line3D(lineVertArray, "LINES", strokeVertArray);
          } else if (curShape === PConstants.TRIANGLES) {
            if (vertArray.length > 2) {
              for (i = 0; (i+2) < vertArray.length; i+=3) {
                fillVertArray = [];
                texVertArray = [];
                lineVertArray = [];
                colorVertArray = [];
                strokeVertArray = [];
                for (j = 0; j < 3; j++) {
                  for (k = 0; k < 3; k++) {
                    lineVertArray.push(vertArray[i+j][k]);
                    fillVertArray.push(vertArray[i+j][k]);
                  }
                }
                for (j = 0; j < 3; j++) {
                  for (k = 3; k < 5; k++) {
                    texVertArray.push(vertArray[i+j][k]);
                  }
                }
                for (j = 0; j < 3; j++) {
                  for (k = 5; k < 9; k++) {
                    colorVertArray.push(vertArray[i+j][k]);
                    strokeVertArray.push(vertArray[i+j][k+4]);
                  }
                }
                if (doStroke) {
                  line3D(lineVertArray, "LINE_LOOP", strokeVertArray );
                }
                if (doFill || usingTexture) {
                  fill3D(fillVertArray, "TRIANGLES", colorVertArray, texVertArray);
                }
              }
            }
          } else if (curShape === PConstants.TRIANGLE_STRIP) {
            if (vertArray.length > 2) {
              for (i = 0; (i+2) < vertArray.length; i++) {
                lineVertArray = [];
                fillVertArray = [];
                strokeVertArray = [];
                colorVertArray = [];
                texVertArray = [];
                for (j = 0; j < 3; j++) {
                  for (k = 0; k < 3; k++) {
                    lineVertArray.push(vertArray[i+j][k]);
                    fillVertArray.push(vertArray[i+j][k]);
                  }
                }
                for (j = 0; j < 3; j++) {
                  for (k = 3; k < 5; k++) {
                    texVertArray.push(vertArray[i+j][k]);
                  }
                }
                for (j = 0; j < 3; j++) {
                  for (k = 5; k < 9; k++) {
                    strokeVertArray.push(vertArray[i+j][k+4]);
                    colorVertArray.push(vertArray[i+j][k]);
                  }
                }

                if (doFill || usingTexture) {
                  fill3D(fillVertArray, "TRIANGLE_STRIP", colorVertArray, texVertArray);
                }
                if (doStroke) {
                  line3D(lineVertArray, "LINE_LOOP", strokeVertArray);
                }
              }
            }
          } else if (curShape === PConstants.TRIANGLE_FAN) {
            if (vertArray.length > 2) {
              for (i = 0; i < 3; i++) {
                for (j = 0; j < 3; j++) {
                  lineVertArray.push(vertArray[i][j]);
                }
              }
              for (i = 0; i < 3; i++) {
                for (j = 9; j < 13; j++) {
                  strokeVertArray.push(vertArray[i][j]);
                }
              }
              if (doStroke) {
                line3D(lineVertArray, "LINE_LOOP", strokeVertArray);
              }

              for (i = 2; (i+1) < vertArray.length; i++) {
                lineVertArray = [];
                strokeVertArray = [];
                lineVertArray.push(vertArray[0][0]);
                lineVertArray.push(vertArray[0][1]);
                lineVertArray.push(vertArray[0][2]);

                strokeVertArray.push(vertArray[0][9]);
                strokeVertArray.push(vertArray[0][10]);
                strokeVertArray.push(vertArray[0][11]);
                strokeVertArray.push(vertArray[0][12]);

                for (j = 0; j < 2; j++) {
                  for (k = 0; k < 3; k++) {
                    lineVertArray.push(vertArray[i+j][k]);
                  }
                }
                for (j = 0; j < 2; j++) {
                  for (k = 9; k < 13; k++) {
                    strokeVertArray.push(vertArray[i+j][k]);
                  }
                }
                if (doStroke) {
                  line3D(lineVertArray, "LINE_STRIP",strokeVertArray);
                }
              }
              if (doFill || usingTexture) {
                fill3D(fillVertArray, "TRIANGLE_FAN", colorVertArray, texVertArray);
              }
            }
          } else if (curShape === PConstants.QUADS) {
            for (i = 0; (i + 3) < vertArray.length; i+=4) {
              lineVertArray = [];
              for (j = 0; j < 4; j++) {
                for (k = 0; k < 3; k++) {
                  lineVertArray.push(vertArray[i+j][k]);
                }
              }
              if (doStroke) {
                line3D(lineVertArray, "LINE_LOOP",strokeVertArray);
              }

              if (doFill) {
                fillVertArray = [];
                colorVertArray = [];
                texVertArray = [];
                for (j = 0; j < 3; j++) {
                  fillVertArray.push(vertArray[i][j]);
                }
                for (j = 5; j < 9; j++) {
                  colorVertArray.push(vertArray[i][j]);
                }

                for (j = 0; j < 3; j++) {
                  fillVertArray.push(vertArray[i+1][j]);
                }
                for (j = 5; j < 9; j++) {
                  colorVertArray.push(vertArray[i+1][j]);
                }

                for (j = 0; j < 3; j++) {
                  fillVertArray.push(vertArray[i+3][j]);
                }
                for (j = 5; j < 9; j++) {
                  colorVertArray.push(vertArray[i+3][j]);
                }

                for (j = 0; j < 3; j++) {
                  fillVertArray.push(vertArray[i+2][j]);
                }
                for (j = 5; j < 9; j++) {
                  colorVertArray.push(vertArray[i+2][j]);
                }

                if (usingTexture) {
                  texVertArray.push(vertArray[i+0][3]);
                  texVertArray.push(vertArray[i+0][4]);
                  texVertArray.push(vertArray[i+1][3]);
                  texVertArray.push(vertArray[i+1][4]);
                  texVertArray.push(vertArray[i+3][3]);
                  texVertArray.push(vertArray[i+3][4]);
                  texVertArray.push(vertArray[i+2][3]);
                  texVertArray.push(vertArray[i+2][4]);
                }

                fill3D(fillVertArray, "TRIANGLE_STRIP", colorVertArray, texVertArray);
              }
            }
          } else if (curShape === PConstants.QUAD_STRIP) {
            var tempArray = [];
            if (vertArray.length > 3) {
              for (i = 0; i < 2; i++) {
                for (j = 0; j < 3; j++) {
                  lineVertArray.push(vertArray[i][j]);
                }
              }

              for (i = 0; i < 2; i++) {
                for (j = 9; j < 13; j++) {
                  strokeVertArray.push(vertArray[i][j]);
                }
              }

              line3D(lineVertArray, "LINE_STRIP", strokeVertArray);
              if (vertArray.length > 4 && vertArray.length % 2 > 0) {
                tempArray = fillVertArray.splice(fillVertArray.length - 3);
                vertArray.pop();
              }
              for (i = 0; (i+3) < vertArray.length; i+=2) {
                lineVertArray = [];
                strokeVertArray = [];
                for (j = 0; j < 3; j++) {
                  lineVertArray.push(vertArray[i+1][j]);
                }
                for (j = 0; j < 3; j++) {
                  lineVertArray.push(vertArray[i+3][j]);
                }
                for (j = 0; j < 3; j++) {
                  lineVertArray.push(vertArray[i+2][j]);
                }
                for (j = 0; j < 3; j++) {
                  lineVertArray.push(vertArray[i+0][j]);
                }
                for (j = 9; j < 13; j++) {
                  strokeVertArray.push(vertArray[i+1][j]);
                }
                for (j = 9; j < 13; j++) {
                  strokeVertArray.push(vertArray[i+3][j]);
                }
                for (j = 9; j < 13; j++) {
                  strokeVertArray.push(vertArray[i+2][j]);
                }
                for (j = 9; j < 13; j++) {
                  strokeVertArray.push(vertArray[i+0][j]);
                }
                if (doStroke) {
                  line3D(lineVertArray, "LINE_STRIP", strokeVertArray);
                }
              }

              if (doFill || usingTexture) {
                fill3D(fillVertArray, "TRIANGLE_LIST", colorVertArray, texVertArray);
              }
            }
          }
          // If the user didn't specify a type (LINES, TRIANGLES, etc)
          else {
            // If only one vertex was specified, it must be a point
            if (vertArray.length === 1) {
              for (j = 0; j < 3; j++) {
                lineVertArray.push(vertArray[0][j]);
              }
              for (j = 9; j < 13; j++) {
                strokeVertArray.push(vertArray[0][j]);
              }
              point3D(lineVertArray,strokeVertArray);
            } else {
              for (i = 0; i < vertArray.length; i++) {
                for (j = 0; j < 3; j++) {
                  lineVertArray.push(vertArray[i][j]);
                }
                for (j = 5; j < 9; j++) {
                  strokeVertArray.push(vertArray[i][j]);
                }
              }
              if (closeShape) {
                line3D(lineVertArray, "LINE_LOOP", strokeVertArray);
              } else {
                line3D(lineVertArray, "LINE_STRIP", strokeVertArray);
              }

              // fill is ignored if textures are used
              if (doFill || usingTexture) {
                fill3D(fillVertArray, "TRIANGLE_FAN", colorVertArray, texVertArray);
              }
            }
          }
          // everytime beginShape is followed by a call to
          // texture(), texturing it turned back on. We do this to
          // figure out if the shape should be textured or filled
          // with a color.
          usingTexture = false;
          curContext.useProgram(programObject3D);
          uniformi(programObject3D, "usingTexture", usingTexture);
        }

        // 2D context
        else {
          if (curShape === PConstants.POINTS) {
            for (i = 0; i < vertArray.length; i++) {
              if (doStroke) {
                p.stroke(vertArray[i][6]);
              }
              p.point(vertArray[i][0], vertArray[i][1]);
            }
          } else if (curShape === PConstants.LINES) {
            for (i = 0; (i + 1) < vertArray.length; i+=2) {
              if (doStroke) {
                p.stroke(vertArray[i+1][6]);
              }
              p.line(vertArray[i][0], vertArray[i][1], vertArray[i+1][0], vertArray[i+1][1]);
            }
          } else if (curShape === PConstants.TRIANGLES) {
            for (i = 0; (i + 2) < vertArray.length; i+=3) {
              curContext.beginPath();
              curContext.moveTo(vertArray[i][0], vertArray[i][1]);
              curContext.lineTo(vertArray[i+1][0], vertArray[i+1][1]);
              curContext.lineTo(vertArray[i+2][0], vertArray[i+2][1]);
              curContext.lineTo(vertArray[i][0], vertArray[i][1]);

              if (doFill) {
                p.fill(vertArray[i+2][5]);
                executeContextFill();
              }
              if (doStroke) {
                p.stroke(vertArray[i+2][6]);
                executeContextStroke();
              }

              curContext.closePath();
            }
          } else if (curShape === PConstants.TRIANGLE_STRIP) {
            for (i = 0; (i+1) < vertArray.length; i++) {
              curContext.beginPath();
              curContext.moveTo(vertArray[i+1][0], vertArray[i+1][1]);
              curContext.lineTo(vertArray[i][0], vertArray[i][1]);

              if (doStroke) {
                p.stroke(vertArray[i+1][6]);
              }
              if (doFill) {
                p.fill(vertArray[i+1][5]);
              }

              if (i + 2 < vertArray.length) {
                curContext.lineTo(vertArray[i+2][0], vertArray[i+2][1]);
                if (doStroke) {
                  p.stroke(vertArray[i+2][6]);
                }
                if (doFill) {
                  p.fill(vertArray[i+2][5]);
                }
              }
              executeContextFill();
              executeContextStroke();
              curContext.closePath();
            }
          } else if (curShape === PConstants.TRIANGLE_FAN) {
            if (vertArray.length > 2) {
              curContext.beginPath();
              curContext.moveTo(vertArray[0][0], vertArray[0][1]);
              curContext.lineTo(vertArray[1][0], vertArray[1][1]);
              curContext.lineTo(vertArray[2][0], vertArray[2][1]);

              if (doFill) {
                p.fill(vertArray[2][5]);
                executeContextFill();
              }
              if (doStroke) {
                p.stroke(vertArray[2][6]);
                executeContextStroke();
              }

              curContext.closePath();
              for (i = 3; i < vertArray.length; i++) {
                curContext.beginPath();
                curContext.moveTo(vertArray[0][0], vertArray[0][1]);
                curContext.lineTo(vertArray[i-1][0], vertArray[i-1][1]);
                curContext.lineTo(vertArray[i][0], vertArray[i][1]);

                if (doFill) {
                  p.fill(vertArray[i][5]);
                  executeContextFill();
                }
                if (doStroke) {
                  p.stroke(vertArray[i][6]);
                  executeContextStroke();
                }

                curContext.closePath();
              }
            }
          } else if (curShape === PConstants.QUADS) {
            for (i = 0; (i + 3) < vertArray.length; i+=4) {
              curContext.beginPath();
              curContext.moveTo(vertArray[i][0], vertArray[i][1]);
              for (j = 1; j < 4; j++) {
                curContext.lineTo(vertArray[i+j][0], vertArray[i+j][1]);
              }
              curContext.lineTo(vertArray[i][0], vertArray[i][1]);

              if (doFill) {
                p.fill(vertArray[i+3][5]);
                executeContextFill();
              }
              if (doStroke) {
                p.stroke(vertArray[i+3][6]);
                executeContextStroke();
              }

              curContext.closePath();
            }
          } else if (curShape === PConstants.QUAD_STRIP) {
            if (vertArray.length > 3) {
              for (i = 0; (i+1) < vertArray.length; i+=2) {
                curContext.beginPath();
                if (i+3 < vertArray.length) {
                  curContext.moveTo(vertArray[i+2][0], vertArray[i+2][1]);
                  curContext.lineTo(vertArray[i][0], vertArray[i][1]);
                  curContext.lineTo(vertArray[i+1][0], vertArray[i+1][1]);
                  curContext.lineTo(vertArray[i+3][0], vertArray[i+3][1]);

                  if (doFill) {
                    p.fill(vertArray[i+3][5]);
                  }
                  if (doStroke) {
                    p.stroke(vertArray[i+3][6]);
                  }
                } else {
                  curContext.moveTo(vertArray[i][0], vertArray[i][1]);
                  curContext.lineTo(vertArray[i+1][0], vertArray[i+1][1]);
                }
                executeContextFill();
                executeContextStroke();
                curContext.closePath();
              }
            }
          } else {
            curContext.beginPath();
            curContext.moveTo(vertArray[0][0], vertArray[0][1]);
            for (i = 1; i < vertArray.length; i++) {
              if (vertArray[i]["isVert"] === true ) { //if it is a vertex move to the position
                if (vertArray[i]["moveTo"] === true) {
                  curContext.moveTo(vertArray[i][0], vertArray[i][1]);
                } else if (vertArray[i]["moveTo"] === false){
                  curContext.lineTo(vertArray[i][0], vertArray[i][1]);
                } else {
                  curContext.lineTo(vertArray[i][0], vertArray[i][1]);
                }
              }
            }
            if (closeShape) {
              curContext.lineTo(vertArray[0][0], vertArray[0][1]);
            }
            executeContextFill();
            executeContextStroke();
            curContext.closePath();
          }
        }
      }
      isCurve = false;
      isBezier = false;
      curveVertArray = [];
      curveVertCount = 0;
    };

    //used by both curveDetail and bezierDetail
    var splineForward = function(segments, matrix) {
      var f = 1.0 / segments;
      var ff = f * f;
      var fff = ff * f;

      matrix.set(0, 0, 0, 1, fff, ff, f, 0, 6 * fff, 2 * ff, 0, 0, 6 * fff, 0, 0, 0);
    };

    //internal curveInit
    //used by curveDetail, curveTightness
    var curveInit = function() {
      // allocate only if/when used to save startup time
      if (!curveDrawMatrix) {
        curveBasisMatrix = new PMatrix3D();
        curveDrawMatrix = new PMatrix3D();
        curveInited = true;
      }

      var s = curTightness;
      curveBasisMatrix.set(((s - 1) / 2).toFixed(2), ((s + 3) / 2).toFixed(2),
                           ((-3 - s) / 2).toFixed(2), ((1 - s) / 2).toFixed(2),
                           (1 - s), ((-5 - s) / 2).toFixed(2), (s + 2), ((s - 1) / 2).toFixed(2),
                           ((s - 1) / 2).toFixed(2), 0, ((1 - s) / 2).toFixed(2), 0, 0, 1, 0, 0);

      splineForward(curveDet, curveDrawMatrix);

      if (!bezierBasisInverse) {
        //bezierBasisInverse = bezierBasisMatrix.get();
        //bezierBasisInverse.invert();
        curveToBezierMatrix = new PMatrix3D();
      }

      // TODO only needed for PGraphicsJava2D? if so, move it there
      // actually, it's generally useful for other renderers, so keep it
      // or hide the implementation elsewhere.
      curveToBezierMatrix.set(curveBasisMatrix);
      curveToBezierMatrix.preApply(bezierBasisInverse);

      // multiply the basis and forward diff matrices together
      // saves much time since this needn't be done for each curve
      curveDrawMatrix.apply(curveBasisMatrix);
    };

    p.bezierVertex = function bezierVertex() {
      isBezier = true;
      var vert = [];
      if (firstVert) {
        throw ("vertex() must be used at least once before calling bezierVertex()");
      } else {
        if (arguments.length === 9) {
          if (p.use3DContext) {
            if (bezierDrawMatrix === undef) {
              bezierDrawMatrix = new PMatrix3D();
            }
            // setup matrix for forward differencing to speed up drawing
            var lastPoint = vertArray.length - 1;
            splineForward( bezDetail, bezierDrawMatrix );
            bezierDrawMatrix.apply( bezierBasisMatrix );
            var draw = bezierDrawMatrix.array();
            var x1 = vertArray[lastPoint][0],
                y1 = vertArray[lastPoint][1],
                z1 = vertArray[lastPoint][2];
            var xplot1 = draw[4] * x1 + draw[5] * arguments[0] + draw[6] * arguments[3] + draw[7] * arguments[6];
            var xplot2 = draw[8] * x1 + draw[9] * arguments[0] + draw[10]* arguments[3] + draw[11]* arguments[6];
            var xplot3 = draw[12]* x1 + draw[13]* arguments[0] + draw[14]* arguments[3] + draw[15]* arguments[6];

            var yplot1 = draw[4] * y1 + draw[5] * arguments[1] + draw[6] * arguments[4] + draw[7] * arguments[7];
            var yplot2 = draw[8] * y1 + draw[9] * arguments[1] + draw[10]* arguments[4] + draw[11]* arguments[7];
            var yplot3 = draw[12]* y1 + draw[13]* arguments[1] + draw[14]* arguments[4] + draw[15]* arguments[7];

            var zplot1 = draw[4] * z1 + draw[5] * arguments[2] + draw[6] * arguments[5] + draw[7] * arguments[8];
            var zplot2 = draw[8] * z1 + draw[9] * arguments[2] + draw[10]* arguments[5] + draw[11]* arguments[8];
            var zplot3 = draw[12]* z1 + draw[13]* arguments[2] + draw[14]* arguments[5] + draw[15]* arguments[8];
            for (var j = 0; j < bezDetail; j++) {
              x1 += xplot1; xplot1 += xplot2; xplot2 += xplot3;
              y1 += yplot1; yplot1 += yplot2; yplot2 += yplot3;
              z1 += zplot1; zplot1 += zplot2; zplot2 += zplot3;
              p.vertex(x1, y1, z1);
            }
            p.vertex(arguments[6], arguments[7], arguments[8]);
          }
        } else {
          for (var i = 0; i < arguments.length; i++) {
            vert[i] = arguments[i];
          }
          vertArray.push(vert);
          vertArray[vertArray.length -1]["isVert"] = false;
        }
      }
    };

    // texImage2D function changed http://www.khronos.org/webgl/public-mailing-list/archives/1007/msg00034.html
    // This method tries the new argument pattern first and falls back to the old version
    var executeTexImage2D = function () {
      var canvas2d = document.createElement('canvas');

      try { // new way.
        curContext.texImage2D(curContext.TEXTURE_2D, 0, curContext.RGBA, curContext.RGBA, curContext.UNSIGNED_BYTE, canvas2d);
        executeTexImage2D = function(texture) {
          curContext.texImage2D(curContext.TEXTURE_2D, 0, curContext.RGBA, curContext.RGBA, curContext.UNSIGNED_BYTE, texture);
        };
      } catch (e) {
        executeTexImage2D = function(texture) {
          curContext.texImage2D(curContext.TEXTURE_2D, 0, texture, false);
        };
      }

      executeTexImage2D.apply(this, arguments);
    };

    p.texture = function(pimage) {
      if (pimage.localName === "canvas") {
        curContext.bindTexture(curContext.TEXTURE_2D, canTex);
        executeTexImage2D(pimage);
        curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_MAG_FILTER, curContext.LINEAR);
        curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_MIN_FILTER, curContext.LINEAR);
        curContext.generateMipmap(curContext.TEXTURE_2D);
      } else if (!pimage.__texture) {
        var texture = curContext.createTexture();
        pimage.__texture = texture;

        var cvs = document.createElement('canvas');
        cvs.width = pimage.width;
        cvs.height = pimage.height;
        var ctx = cvs.getContext('2d');
        var textureImage = ctx.createImageData(cvs.width, cvs.height);

        var imgData = pimage.toImageData();

        for (var i = 0; i < cvs.width; i += 1) {
          for (var j = 0; j < cvs.height; j += 1) {
          var index = (j * cvs.width + i) * 4;
            textureImage.data[index + 0] = imgData.data[index + 0];
            textureImage.data[index + 1] = imgData.data[index + 1];
            textureImage.data[index + 2] = imgData.data[index + 2];
            textureImage.data[index + 3] = 255;
          }
        }

        ctx.putImageData(textureImage, 0, 0);
        pimage.__cvs = cvs;

        curContext.bindTexture(curContext.TEXTURE_2D, pimage.__texture);
        curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_MIN_FILTER, curContext.LINEAR_MIPMAP_LINEAR);
        curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_MAG_FILTER, curContext.LINEAR);
        curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_WRAP_T, curContext.CLAMP_TO_EDGE);
        curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_WRAP_S, curContext.CLAMP_TO_EDGE);
        executeTexImage2D(pimage.__cvs);
        curContext.generateMipmap(curContext.TEXTURE_2D);
      } else {
        curContext.bindTexture(curContext.TEXTURE_2D, pimage.__texture);
      }

      curTexture.width = pimage.width;
      curTexture.height = pimage.height;
      usingTexture = true;
      curContext.useProgram(programObject3D);
      uniformi(programObject3D, "usingTexture", usingTexture);
    };

    p.textureMode = function(mode){
      curTextureMode = mode;
    };

    var curveVertexSegment = function(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
      var x0 = x2;
      var y0 = y2;
      var z0 = z2;

      var draw = curveDrawMatrix.array();

      var xplot1 = draw[4] * x1 + draw[5] * x2 + draw[6] * x3 + draw[7] * x4;
      var xplot2 = draw[8] * x1 + draw[9] * x2 + draw[10] * x3 + draw[11] * x4;
      var xplot3 = draw[12] * x1 + draw[13] * x2 + draw[14] * x3 + draw[15] * x4;

      var yplot1 = draw[4] * y1 + draw[5] * y2 + draw[6] * y3 + draw[7] * y4;
      var yplot2 = draw[8] * y1 + draw[9] * y2 + draw[10] * y3 + draw[11] * y4;
      var yplot3 = draw[12] * y1 + draw[13] * y2 + draw[14] * y3 + draw[15] * y4;

      var zplot1 = draw[4] * z1 + draw[5] * z2 + draw[6] * z3 + draw[7] * z4;
      var zplot2 = draw[8] * z1 + draw[9] * z2 + draw[10] * z3 + draw[11] * z4;
      var zplot3 = draw[12] * z1 + draw[13] * z2 + draw[14] * z3 + draw[15] * z4;

      p.vertex(x0, y0, z0);
      for (var j = 0; j < curveDet; j++) {
        x0 += xplot1; xplot1 += xplot2; xplot2 += xplot3;
        y0 += yplot1; yplot1 += yplot2; yplot2 += yplot3;
        z0 += zplot1; zplot1 += zplot2; zplot2 += zplot3;
        p.vertex(x0, y0, z0);
      }
    };

    p.curveVertex = function(x, y, z) {
      isCurve = true;
      if(p.use3DContext){
        if (!curveInited){
          curveInit();
        }
        var vert = [];
        vert[0] = x;
        vert[1] = y;
        vert[2] = z;
        curveVertArray.push(vert);
        curveVertCount++;

        if (curveVertCount > 3){
          curveVertexSegment( curveVertArray[curveVertCount-4][0],
                              curveVertArray[curveVertCount-4][1],
                              curveVertArray[curveVertCount-4][2],
                              curveVertArray[curveVertCount-3][0],
                              curveVertArray[curveVertCount-3][1],
                              curveVertArray[curveVertCount-3][2],
                              curveVertArray[curveVertCount-2][0],
                              curveVertArray[curveVertCount-2][1],
                              curveVertArray[curveVertCount-2][2],
                              curveVertArray[curveVertCount-1][0],
                              curveVertArray[curveVertCount-1][1],
                              curveVertArray[curveVertCount-1][2] );
        }
      }
      else{
        p.vertex(x, y, z);
      }
    };

    p.curve = function curve() {
      if (arguments.length === 8) // curve(x1, y1, x2, y2, x3, y3, x4, y4)
      {
        p.beginShape();
        p.curveVertex(arguments[0], arguments[1]);
        p.curveVertex(arguments[2], arguments[3]);
        p.curveVertex(arguments[4], arguments[5]);
        p.curveVertex(arguments[6], arguments[7]);
        p.endShape();
      } else { // curve( x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4);
        if (p.use3DContext) {
          p.beginShape();
          p.curveVertex(arguments[0], arguments[1], arguments[2]);
          p.curveVertex(arguments[3], arguments[4], arguments[5]);
          p.curveVertex(arguments[6], arguments[7], arguments[8]);
          p.curveVertex(arguments[9], arguments[10], arguments[11]);
          p.endShape();
        }
      }
    };

    p.curveTightness = function(tightness) {
      curTightness = tightness;
    };

    p.curveDetail = function curveDetail( detail ) {
      curveDet = detail;
      curveInit();
    };

    p.rectMode = function rectMode(aRectMode) {
      curRectMode = aRectMode;
    };

    p.imageMode = function(mode) {
      switch (mode) {
      case PConstants.CORNER:
        imageModeConvert = imageModeCorner;
        break;
      case PConstants.CORNERS:
        imageModeConvert = imageModeCorners;
        break;
      case PConstants.CENTER:
        imageModeConvert = imageModeCenter;
        break;
      default:
        throw "Invalid imageMode";
      }
    };

    p.ellipseMode = function ellipseMode(aEllipseMode) {
      curEllipseMode = aEllipseMode;
    };

    p.arc = function arc(x, y, width, height, start, stop) {
      if (width <= 0) {
        return;
      }

      if (curEllipseMode === PConstants.CORNER) {
        x += width / 2;
        y += height / 2;
      }

      curContext.moveTo(x, y);
      curContext.beginPath();
      curContext.arc(x, y, curEllipseMode === PConstants.CENTER_RADIUS ? width : width / 2, start, stop, false);

      executeContextStroke();
      curContext.lineTo(x, y);

      executeContextFill();
      curContext.closePath();
    };

    p.line = function line() {
      var x1, y1, z1, x2, y2, z2;

      if (p.use3DContext) {
        if (arguments.length === 6) {
          x1 = arguments[0];
          y1 = arguments[1];
          z1 = arguments[2];
          x2 = arguments[3];
          y2 = arguments[4];
          z2 = arguments[5];
        } else if (arguments.length === 4) {
          x1 = arguments[0];
          y1 = arguments[1];
          z1 = 0;
          x2 = arguments[2];
          y2 = arguments[3];
          z2 = 0;
        }

        var lineVerts = [x1, y1, z1, x2, y2, z2];

        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.transpose();

        var proj = new PMatrix3D();
        proj.set(projection);
        proj.transpose();

        if (lineWidth > 0 && doStroke) {
          curContext.useProgram(programObject2D);

          uniformMatrix(programObject2D, "model", false, [1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1]);
          uniformMatrix(programObject2D, "view", false, view.array());
          uniformMatrix(programObject2D, "projection", false, proj.array());

          uniformf(programObject2D, "color", strokeStyle);
          uniformi(programObject2D, "picktype", 0);

          curContext.lineWidth(lineWidth);

          vertexAttribPointer(programObject2D, "Vertex", 3, lineBuffer);
          disableVertexAttribPointer(programObject2D, "aTextureCoord");

          curContext.bufferData(curContext.ARRAY_BUFFER, new Float32Array(lineVerts), curContext.STREAM_DRAW);
          curContext.drawArrays(curContext.LINES, 0, 2);
        }
      } else {
        x1 = arguments[0];
        y1 = arguments[1];
        x2 = arguments[2];
        y2 = arguments[3];

        // if line is parallel to axis and lineWidth is less than 1px, trying to do it "crisp"
        if ((x1 === x2 || y1 === y2) && lineWidth <= 1.0 && doStroke && curSketch.options.crispLines) {
          var temp;
          if(x1 === x2) {
            if(y1 > y2) { temp = y1; y1 = y2; y2 = temp; }
            for(var y=y1;y<=y2;++y) {
              p.set(x1, y, currentStrokeColor);
            }
          } else {
            if(x1 > x2) { temp = x1; x1 = x2; x2 = temp; }
            for(var x=x1;x<=x2;++x) {
              p.set(x, y1, currentStrokeColor);
            }
          }
          return;
        }

        if (doStroke) {
          curContext.beginPath();
          curContext.moveTo(x1 || 0, y1 || 0);
          curContext.lineTo(x2 || 0, y2 || 0);
          executeContextStroke();
          curContext.closePath();
        }
      }
    };

    p.bezier = function bezier() {
      if( arguments.length === 8 && !p.use3DContext ){
          p.beginShape();
          p.vertex( arguments[0], arguments[1] );
          p.bezierVertex( arguments[2], arguments[3],
                          arguments[4], arguments[5],
                          arguments[6], arguments[7] );
          p.endShape();
      }
      else if( arguments.length === 12 && p.use3DContext ){
          p.beginShape();
          p.vertex( arguments[0], arguments[1], arguments[2] );
          p.bezierVertex( arguments[3], arguments[4], arguments[5],
                          arguments[6], arguments[7], arguments[8],
                          arguments[9], arguments[10], arguments[11] );
          p.endShape();
      }
      else {
        throw("Please use the proper parameters!");
      }
    };
    p.bezierDetail = function bezierDetail( detail ){
      bezDetail = detail;
    };

    p.bezierPoint = function bezierPoint(a, b, c, d, t) {
      return (1 - t) * (1 - t) * (1 - t) * a + 3 * (1 - t) * (1 - t) * t * b + 3 * (1 - t) * t * t * c + t * t * t * d;
    };

    p.bezierTangent = function bezierTangent(a, b, c, d, t) {
      return (3 * t * t * (-a + 3 * b - 3 * c + d) + 6 * t * (a - 2 * b + c) + 3 * (-a + b));
    };

    p.curvePoint = function curvePoint(a, b, c, d, t) {
      return 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
    };

    p.curveTangent = function curveTangent(a, b, c, d, t) {
      return 0.5 * ((-a + c) + 2 * (2 * a - 5 * b + 4 * c - d) * t + 3 * (-a + 3 * b - 3 * c + d) * t * t);
    };

    p.triangle = function triangle(x1, y1, x2, y2, x3, y3) {
      p.beginShape(PConstants.TRIANGLES);
      p.vertex(x1, y1, 0);
      p.vertex(x2, y2, 0);
      p.vertex(x3, y3, 0);
      p.endShape();
    };

    p.quad = function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
      p.beginShape(PConstants.QUADS);
      p.vertex(x1, y1, 0);
      p.vertex(x2, y2, 0);
      p.vertex(x3, y3, 0);
      p.vertex(x4, y4, 0);
      p.endShape();
    };

    p.rect = function rect(x, y, width, height) {
      if (p.use3DContext) {
        // Modeling transformation
        var model = new PMatrix3D();
        model.translate(x, y, 0);
        model.scale(width, height, 1);
        model.transpose();

        // viewing transformation needs to have Y flipped
        // becuase that's what Processing does.
        var view = new PMatrix3D();
        view.scale(1, -1, 1);
        view.apply(modelView.array());
        view.transpose();

        var proj = new PMatrix3D();
        proj.set(projection);
        proj.transpose();

        if (lineWidth > 0 && doStroke) {
          curContext.useProgram(programObject2D);
          uniformMatrix(programObject2D, "model", false, model.array());
          uniformMatrix(programObject2D, "view", false, view.array());
          uniformMatrix(programObject2D, "projection", false, proj.array());

          uniformf(programObject2D, "color", strokeStyle);
          uniformi(programObject2D, "picktype", 0);

          vertexAttribPointer(programObject2D, "Vertex", 3, rectBuffer);
          disableVertexAttribPointer(programObject2D, "aTextureCoord");

          curContext.lineWidth(lineWidth);
          curContext.drawArrays(curContext.LINE_LOOP, 0, rectVerts.length / 3);
        }

        if (doFill) {
          curContext.useProgram(programObject3D);
          uniformMatrix(programObject3D, "model", false, model.array());
          uniformMatrix(programObject3D, "view", false, view.array());
          uniformMatrix(programObject3D, "projection", false, proj.array());

          // fix stitching problems. (lines get occluded by triangles
          // since they share the same depth values). This is not entirely
          // working, but it's a start for drawing the outline. So
          // developers can start playing around with styles.
          curContext.enable(curContext.POLYGON_OFFSET_FILL);
          curContext.polygonOffset(1, 1);

          uniformf(programObject3D, "color", fillStyle);

          var v = new PMatrix3D();
          v.set(view);

          var m = new PMatrix3D();
          m.set(model);

          v.mult(m);

          var normalMatrix = new PMatrix3D();
          normalMatrix.set(v);
          normalMatrix.invert();
          normalMatrix.transpose();

          uniformMatrix(programObject3D, "normalTransform", false, normalMatrix.array());

          vertexAttribPointer(programObject3D, "Vertex", 3, rectBuffer);
          vertexAttribPointer(programObject3D, "Normal", 3, rectNormBuffer);

          curContext.drawArrays(curContext.TRIANGLE_FAN, 0, rectVerts.length / 3);
          curContext.disable(curContext.POLYGON_OFFSET_FILL);
        }
      }
      else{
        if (!width && !height) {
          return;
        }

        // if only stroke is enabled, do it "crisp"
        if (doStroke && !doFill && lineWidth <= 1.0 && curSketch.options.crispLines) {
          var i, x2 = x + width - 1, y2 = y + height - 1;
          for(i=0;i<width;++i) {
            p.set(x + i, y, currentStrokeColor);
            p.set(x + i, y2, currentStrokeColor);
          }
          for(i=0;i<height;++i) {
            p.set(x, y + i, currentStrokeColor);
            p.set(x2, y + i, currentStrokeColor);
          }
          return;
        }

        curContext.beginPath();

        var offsetStart = 0;
        var offsetEnd = 0;

        if (curRectMode === PConstants.CORNERS) {
          width -= x;
          height -= y;
        }

        if (curRectMode === PConstants.RADIUS) {
          width *= 2;
          height *= 2;
        }

        if (curRectMode === PConstants.CENTER || curRectMode === PConstants.RADIUS) {
          x -= width / 2;
          y -= height / 2;
        }

        curContext.rect(
        Math.round(x) - offsetStart, Math.round(y) - offsetStart, Math.round(width) + offsetEnd, Math.round(height) + offsetEnd);

        executeContextFill();
        executeContextStroke();

        curContext.closePath();
      }
    };

    p.ellipse = function ellipse(x, y, width, height) {
      x = x || 0;
      y = y || 0;

      if (width <= 0 && height <= 0) {
        return;
      }

      if (curEllipseMode === PConstants.RADIUS) {
        width *= 2;
        height *= 2;
      }

      if (curEllipseMode === PConstants.CORNERS) {
        width = width - x;
        height = height - y;
      }

      if (curEllipseMode === PConstants.CORNER || curEllipseMode === PConstants.CORNERS) {
        x += width / 2;
        y += height / 2;
      }

      var offsetStart = 0;

      // Shortcut for drawing a 2D circle
      if ((!p.use3DContext) && (width === height)) {
        curContext.beginPath();
        curContext.arc(x - offsetStart, y - offsetStart, width / 2, 0, PConstants.TWO_PI, false);
        executeContextFill();
        executeContextStroke();
        curContext.closePath();
      }
      else {
        var w = width / 2,
          h = height / 2,
          C = 0.5522847498307933;
        var c_x = C * w,
          c_y = C * h;

        if(!p.use3DContext){
          // TODO: Audit
          p.beginShape();
          p.vertex(x + w, y);
          p.bezierVertex(x + w, y - c_y, x + c_x, y - h, x, y - h);
          p.bezierVertex(x - c_x, y - h, x - w, y - c_y, x - w, y);
          p.bezierVertex(x - w, y + c_y, x - c_x, y + h, x, y + h);
          p.bezierVertex(x + c_x, y + h, x + w, y + c_y, x + w, y);
          p.endShape();
        }
        else{
          p.beginShape();
          p.vertex(x + w, y);
          p.bezierVertex(x + w, y - c_y, 0, x + c_x, y - h, 0, x, y - h, 0);
          p.bezierVertex(x - c_x, y - h, 0, x - w, y - c_y, 0, x - w, y, 0);
          p.bezierVertex(x - w, y + c_y, 0, x - c_x, y + h, 0, x, y + h, 0);
          p.bezierVertex(x + c_x, y + h, 0, x + w, y + c_y, 0, x + w, y, 0);
          p.endShape();

          //temporary workaround to not working fills for bezier -- will fix later
          var xAv = 0, yAv = 0, i, j;
          for(i = 0; i < vertArray.length; i++){
            xAv += vertArray[i][0];
            yAv += vertArray[i][1];
          }
          xAv /= vertArray.length;
          yAv /= vertArray.length;
          var vert = [],
              fillVertArray = [],
              colorVertArray = [];
          vert[0] = xAv;
          vert[1] = yAv;
          vert[2] = 0;
          vert[3] = 0;
          vert[4] = 0;
          vert[5] = fillStyle[0];
          vert[6] = fillStyle[1];
          vert[7] = fillStyle[2];
          vert[8] = fillStyle[3];
          vert[9] = strokeStyle[0];
          vert[10] = strokeStyle[1];
          vert[11] = strokeStyle[2];
          vert[12] = strokeStyle[3];
          vert[13] = normalX;
          vert[14] = normalY;
          vert[15] = normalZ;
          vertArray.unshift(vert);
          for(i = 0; i < vertArray.length; i++){
            for(j = 0; j < 3; j++){
              fillVertArray.push(vertArray[i][j]);
            }
            for(j = 5; j < 9; j++){
              colorVertArray.push(vertArray[i][j]);
            }
          }
          fill3D(fillVertArray, "TRIANGLE_FAN", colorVertArray);
        }
      }
    };

    p.normal = function normal(nx, ny, nz) {
      if (arguments.length !== 3 || !(typeof nx === "number" && typeof ny === "number" && typeof nz === "number")) {
        throw "normal() requires three numeric arguments.";
      }

      normalX = nx;
      normalY = ny;
      normalZ = nz;

      if (curShape !== 0) {
        if (normalMode === PConstants.NORMAL_MODE_AUTO) {
          normalMode = PConstants.NORMAL_MODE_SHAPE;
        } else if (normalMode === PConstants.NORMAL_MODE_SHAPE) {
          normalMode = PConstants.NORMAL_MODE_VERTEX;
        }
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Raster drawing functions
    ////////////////////////////////////////////////////////////////////////////

    p.save = function save(file, img) {
      // file is unused at the moment
      // may implement this differently in later release
      if (img !== undef) {
        return window.open(img.toDataURL(),"_blank");
      } else {
        return window.open(p.externals.canvas.toDataURL(),"_blank");
      }
    };

    var utilityContext2d = document.createElement("canvas").getContext("2d");

    var canvasDataCache = [undef, undef, undef]; // we need three for now

    function getCanvasData(obj, w, h) {
      var canvasData = canvasDataCache.shift();

      if (canvasData === undef) {
        canvasData = {};
        canvasData.canvas = document.createElement("canvas");
        canvasData.context = canvasData.canvas.getContext('2d');
      }

      canvasDataCache.push(canvasData);

      var canvas = canvasData.canvas, context = canvasData.context,
          width = w || obj.width, height = h || obj.height;

      canvas.width = width;
      canvas.height = height;

      if (!obj) {
        context.clearRect(0, 0, width, height);
      } else if ("data" in obj) { // ImageData
        context.putImageData(obj, 0, 0);
      } else {
        context.clearRect(0, 0, width, height);
        context.drawImage(obj, 0, 0, width, height);
      }
      return canvasData;
    }

    var PImage = function PImage(aWidth, aHeight, aFormat) {
      this.get = function(x, y, w, h) {
        if (!arguments.length) {
          return p.get(this);
        } else if (arguments.length === 2) {
          return p.get(x, y, this);
        } else if (arguments.length === 4) {
          return p.get(x, y, w, h, this);
        }
      };

      this.set = function(x, y, c) {
        p.set(x, y, c, this);
      };

      this.blend = function(srcImg, x, y, width, height, dx, dy, dwidth, dheight, MODE) {
        if (arguments.length === 9) {
          p.blend(this, srcImg, x, y, width, height, dx, dy, dwidth, dheight, this);
        } else if (arguments.length === 10) {
          p.blend(srcImg, x, y, width, height, dx, dy, dwidth, dheight, MODE, this);
        }
      };

      this.copy = function(srcImg, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        if (arguments.length === 8) {
          p.blend(this, srcImg, sx, sy, swidth, sheight, dx, dy, dwidth, PConstants.REPLACE, this);
        } else if (arguments.length === 9) {
          p.blend(srcImg, sx, sy, swidth, sheight, dx, dy, dwidth, dheight, PConstants.REPLACE, this);
        }
      };

      this.filter = function(mode, param) {
        if (arguments.length === 2) {
          p.filter(mode, param, this);
        } else if (arguments.length === 1) {
          // no param specified, send null to show its invalid
          p.filter(mode, null, this);
        }
      };

      this.save = function(file){
        p.save(file,this);
      };

      this.resize = function(w, h) {
        if (this.isRemote) { // Remote images cannot access imageData
          throw "Image is loaded remotely. Cannot resize.";
        } else {
          if (this.width !== 0 || this.height !== 0) {
            // make aspect ratio if w or h is 0
            if (w === 0 && h !== 0) {
              w = this.width / this.height * h;
            } else if (h === 0 && w !== 0) {
              h = w / (this.width / this.height);
            }
            // put 'this.imageData' into a new canvas
            var canvas = getCanvasData(this.imageData).canvas;
            // pull imageData object out of canvas into ImageData object
            var imageData = getCanvasData(canvas, w, h).context.getImageData(0, 0, w, h);
            // set this as new pimage
            this.fromImageData(imageData);
          }
        }
      };

      this.mask = function(mask) {
        this.__mask = undef;

        if (mask instanceof PImage) {
          if (mask.width === this.width && mask.height === this.height) {
            this.__mask = mask;
          } else {
            throw "mask must have the same dimensions as PImage.";
          }
        } else if (typeof mask === "object" && mask.constructor === Array) { // this is a pixel array
          // mask pixel array needs to be the same length as this.pixels
          // how do we update this for 0.9 this.imageData holding pixels ^^
          // mask.constructor ? and this.pixels.length = this.imageData.data.length instead ?
          if (this.pixels.length === mask.length) {
            this.__mask = mask;
          } else {
            throw "mask array must be the same length as PImage pixels array.";
          }
        }
      };

      // handle the sketch code for pixels[] and pixels.length
      // parser code converts pixels[] to getPixels()
      // or setPixels(), .length becomes getLength()
      this.pixels = {
        getLength: (function(aImg) {
          if (aImg.isRemote) { // Remote images cannot access imageData
            throw "Image is loaded remotely. Cannot get length.";
          } else {
            return function() {
              return aImg.imageData.data.length ? aImg.imageData.data.length/4 : 0;
            };
          }
        }(this)),
        getPixel: (function(aImg) {
          if (aImg.isRemote) { // Remote images cannot access imageData
            throw "Image is loaded remotely. Cannot get pixels.";
          } else {
            return function(i) {
              var offset = i*4;
              return p.color.toInt(aImg.imageData.data[offset], aImg.imageData.data[offset+1],
                                   aImg.imageData.data[offset+2], aImg.imageData.data[offset+3]);
            };
          }
        }(this)),
        setPixel: (function(aImg) {
          if (aImg.isRemote) { // Remote images cannot access imageData
            throw "Image is loaded remotely. Cannot set pixel.";
          } else {
            return function(i,c) {
              var offset = i*4;
              aImg.imageData.data[offset+0] = (c & PConstants.RED_MASK) >>> 16;
              aImg.imageData.data[offset+1] = (c & PConstants.GREEN_MASK) >>> 8;
              aImg.imageData.data[offset+2] = (c & PConstants.BLUE_MASK);
              aImg.imageData.data[offset+3] = (c & PConstants.ALPHA_MASK) >>> 24;
            };
          }
        }(this)),
        set: function(arr) {
          if (this.isRemote) { // Remote images cannot access imageData
            throw "Image is loaded remotely. Cannot set pixels.";
          } else {
            for (var i = 0, aL = arr.length; i < aL; i++) {
              this.setPixel(i, arr[i]);
            }
          }
        }
      };

      // These are intentionally left blank for PImages, we work live with pixels and draw as necessary
      this.loadPixels = function() {};

      this.updatePixels = function() {};

      this.toImageData = function() {
        if (this.isRemote) { // Remote images cannot access imageData, send source image instead
          return this.sourceImg;
        } else {
          var canvasData = getCanvasData(this.imageData);
          return canvasData.context.getImageData(0, 0, this.width, this.height);
        }
      };

      this.toDataURL = function() {
        if (this.isRemote) { // Remote images cannot access imageData
          throw "Image is loaded remotely. Cannot create dataURI.";
        } else {
          var canvasData = getCanvasData(this.imageData);
          return canvasData.canvas.toDataURL();
        }
      };

      this.fromImageData = function(canvasImg) {
        this.width = canvasImg.width;
        this.height = canvasImg.height;
        this.imageData = canvasImg;
        // changed for 0.9
        this.format = PConstants.ARGB;
      };

      this.fromHTMLImageData = function(htmlImg) {
        // convert an <img> to a PImage
        var canvasData = getCanvasData(htmlImg);
        try {
          var imageData = canvasData.context.getImageData(0, 0, htmlImg.width, htmlImg.height);
          this.fromImageData(imageData);
        } catch(e) {
          if (htmlImg.width && htmlImg.height) {
            this.isRemote = true;
            this.width = htmlImg.width;
            this.height = htmlImg.height;
          }
        }
        this.sourceImg = htmlImg;
      };

      if (arguments.length === 1) {
        // convert an <img> to a PImage
        this.fromHTMLImageData(arguments[0]);
      } else if (arguments.length === 2 || arguments.length === 3) {
        this.width = aWidth || 1;
        this.height = aHeight || 1;
        this.imageData = utilityContext2d.createImageData(this.width, this.height);
        this.format = (aFormat === PConstants.ARGB || aFormat === PConstants.ALPHA) ? aFormat : PConstants.RGB;
      } else {
        this.width = 0;
        this.height = 0;
        this.imageData = utilityContext2d.createImageData(1, 1);
        this.format = PConstants.ARGB;
      }
    };

    p.PImage = PImage;

    p.createImage = function createImage(w, h, mode) {
      return new PImage(w,h,mode);
    };

    // Loads an image for display. Type is an extension. Callback is fired on load.
    p.loadImage = function loadImage(file, type, callback) {
      // if type is specified add it with a . to file to make the filename
      if (type) {
        file = file + "." + type;
      }
      // if image is in the preloader cache return a new PImage
      if (curSketch.imageCache.images[file]) {
        return new PImage(curSketch.imageCache.images[file]);
      }
      // else aysnc load it
      else {
        var pimg = new PImage(0, 0, PConstants.ARGB);
        var img = document.createElement('img');

        pimg.sourceImg = img;

        img.onload = (function(aImage, aPImage, aCallback) {
          var image = aImage;
          var pimg = aPImage;
          var callback = aCallback;
          return function() {
            // change the <img> object into a PImage now that its loaded
            pimg.fromHTMLImageData(image);
            pimg.loaded = true;
            if (callback) {
              callback();
            }
          };
        }(img, pimg, callback));

        img.src = file; // needs to be called after the img.onload function is declared or it wont work in opera
        return pimg;
      }
    };

    // async loading of large images, same functionality as loadImage above
    p.requestImage = p.loadImage;

    function get$0() {
      //return a PImage of curContext
      var c = new PImage(p.width, p.height, PConstants.RGB);
      c.fromImageData(curContext.getImageData(0, 0, p.width, p.height));
      return c;
    }
    function get$2(x,y) {
      var data;
      // return the color at x,y (int) of curContext
      // create a PImage object of size 1x1 and return the int of the pixels array element 0
      if (x < p.width && x >= 0 && y >= 0 && y < p.height) {
        if(isContextReplaced) {
          var offset = ((0|x) + p.width * (0|y))*4;
          data = p.imageData.data;
          return p.color.toInt(data[offset], data[offset+1],
                           data[offset+2], data[offset+3]);
        }
        // x,y is inside canvas space
        data = curContext.getImageData(0|x, 0|y, 1, 1).data;
        // changed for 0.9
        return p.color.toInt(data[0], data[1], data[2], data[3]);
      } else {
        // x,y is outside image return transparent black
        return 0;
      }
    }
    function get$3(x,y,img) {
      if (img.isRemote) { // Remote images cannot access imageData
        throw "Image is loaded remotely. Cannot get x,y.";
      } else {
        // PImage.get(x,y) was called, return the color (int) at x,y of img
        // changed in 0.9
        var offset = y * img.width * 4 + (x * 4);
        return p.color.toInt(img.imageData.data[offset],
                           img.imageData.data[offset + 1],
                           img.imageData.data[offset + 2],
                           img.imageData.data[offset + 3]);
      }
    }
    function get$4(x, y, w, h) {
      // return a PImage of w and h from cood x,y of curContext
      var c = new PImage(w, h, PConstants.RGB);
      c.fromImageData(curContext.getImageData(x, y, w, h));
      return c;
    }
    function get$5(x, y, w, h, img) {
      if (img.isRemote) { // Remote images cannot access imageData
        throw "Image is loaded remotely. Cannot get x,y,w,h.";
      } else {
        // PImage.get(x,y,w,h) was called, return x,y,w,h PImage of img
        // changed for 0.9, offset start point needs to be *4
        var start = y * img.width * 4 + (x*4);
        var end = (y + h) * img.width * 4 + ((x + w) * 4);
        var c = new PImage(w, h, PConstants.RGB);
        for (var i = start, j = 0; i < end; i++, j++) {
          // changed in 0.9
          c.imageData.data[j] = img.imageData.data[i];
          if ((j+1) % (w*4) === 0) {
            //completed one line, increment i by offset
            i += (img.width - w) * 4;
          }
        }
        return c;
      }
    }

    // Gets a single pixel or block of pixels from the current Canvas Context or a PImage
    p.get = function get(x, y, w, h, img) {
      // for 0 2 and 4 arguments use curContext, otherwise PImage.get was called
      if (arguments.length === 2) {
        return get$2(x, y);
      } else if (arguments.length === 0) {
        return get$0();
      } else if (arguments.length === 5) {
        return get$5(x, y, w, h, img);
      } else if (arguments.length === 4) {
        return get$4(x, y, w, h);
      } else if (arguments.length === 3) {
        return get$3(x, y, w);
      } else if (arguments.length === 1) {
        // PImage.get() was called, return the PImage
        return x;
      }
    };

    // Creates a new Processing instance and passes it back for... processing
    p.createGraphics = function createGraphics(w, h, render) {
      var canvas = document.createElement("canvas");
      var pg = new Processing(canvas);
      pg.size(w, h, render);
      pg.canvas = canvas;
      //Processing.addInstance(pg); // TODO: this function does not exist in this scope
      return pg;
    };

    // pixels caching
    function resetContext() {
      if(isContextReplaced) {
        curContext = originalContext;
        isContextReplaced = false;

        p.updatePixels();
      }
    }
    function SetPixelContextWrapper() {
      function wrapFunction(newContext, name) {
        function wrapper() {
          resetContext();
          curContext[name].apply(curContext, arguments);
        }
        newContext[name] = wrapper;
      }
      function wrapProperty(newContext, name) {
        function getter() {
          resetContext();
          return curContext[name];
        }
        function setter(value) {
          resetContext();
          curContext[name] = value;
        }
        p.defineProperty(newContext, name, { get: getter, set: setter });
      }
      for(var n in curContext) {
        if(typeof curContext[n] === 'function') {
          wrapFunction(this, n);
        } else {
          wrapProperty(this, n);
        }
      }
    }
    function replaceContext() {
      if(isContextReplaced) {
        return;
      }
      p.loadPixels();
      if(proxyContext === null) {
        originalContext = curContext;
        proxyContext = new SetPixelContextWrapper();
      }
      isContextReplaced = true;
      curContext = proxyContext;
      setPixelsCached = 0;
    }

    function set$3(x, y, c) {
      if (x < p.width && x >= 0 && y >= 0 && y < p.height) {
        replaceContext();
        p.pixels.setPixel((0|x)+p.width*(0|y), c);
        if(++setPixelsCached > maxPixelsCached) {
          resetContext();
        }
      }
    }
    function set$4(x, y, obj, img) {
      if (img.isRemote) { // Remote images cannot access imageData
        throw "Image is loaded remotely. Cannot set x,y.";
      } else {
        var c = p.color.toArray(obj);
        var offset = y * img.width * 4 + (x*4);
        var data = img.imageData.data;
        data[offset] = c[0];
        data[offset+1] = c[1];
        data[offset+2] = c[2];
        data[offset+3] = c[3];
      }
    }
    // Paints a pixel array into the canvas
    p.set = function set(x, y, obj, img) {
      var color, oldFill;
      if (arguments.length === 3) {
        // called p.set(), was it with a color or a img ?
        if (typeof obj === "number") {
          set$3(x, y, obj);
        } else if (obj instanceof PImage) {
          p.image(obj, x, y);
        }
      } else if (arguments.length === 4) {
        // PImage.set(x,y,c) was called, set coordinate x,y color to c of img
        set$4(x, y, obj, img);
      }
    };
    p.imageData = {};

    // handle the sketch code for pixels[]
    // parser code converts pixels[] to getPixels()
    // or setPixels(), .length becomes getLength()
    p.pixels = {
      getLength: function() { return p.imageData.data.length ? p.imageData.data.length/4 : 0; },
      getPixel: function(i) {
        var offset = i*4;
        return (p.imageData.data[offset+3] << 24) & 0xff000000 |
               (p.imageData.data[offset+0] << 16) & 0x00ff0000 |
               (p.imageData.data[offset+1] << 8) & 0x0000ff00 |
               p.imageData.data[offset+2] & 0x000000ff;
      },
      setPixel: function(i,c) {
        var offset = i*4;
        p.imageData.data[offset+0] = (c & 0x00ff0000) >>> 16; // RED_MASK
        p.imageData.data[offset+1] = (c & 0x0000ff00) >>> 8;  // GREEN_MASK
        p.imageData.data[offset+2] = (c & 0x000000ff);        // BLUE_MASK
        p.imageData.data[offset+3] = (c & 0xff000000) >>> 24; // ALPHA_MASK
      },
      set: function(arr) {
        for (var i = 0, aL = arr.length; i < aL; i++) {
          this.setPixel(i, arr[i]);
        }
      }
    };

    // Gets a 1-Dimensional pixel array from Canvas
    p.loadPixels = function() {
      // changed in 0.9
      p.imageData = curContext.getImageData(0, 0, p.width, p.height);
    };

    // Draws a 1-Dimensional pixel array to Canvas
    p.updatePixels = function() {
      // changed in 0.9
      if (p.imageData) {
        curContext.putImageData(p.imageData, 0, 0);
      }
    };

    p.hint = function hint(which) {
      if (which === PConstants.DISABLE_DEPTH_TEST) {
         curContext.disable(curContext.DEPTH_TEST);
         curContext.depthMask(false);
         curContext.clear(curContext.DEPTH_BUFFER_BIT);
      }
      else if (which === PConstants.ENABLE_DEPTH_TEST) {
         curContext.enable(curContext.DEPTH_TEST);
         curContext.depthMask(true);
      }
    };

    // Draw an image or a color to the background
    p.background = function background() {
      var color, a, img;
      // background params are either a color or a PImage
      if (typeof arguments[0] === 'number') {
        color = p.color.apply(this, arguments);

        // override alpha value, processing ignores the alpha for background color
        if (!curSketch.options.isTransparent) {
          color = color | PConstants.ALPHA_MASK;
        }
      } else if (arguments.length === 1 && arguments[0] instanceof PImage) {
        img = arguments[0];

        if (!img.pixels || img.width !== p.width || img.height !== p.height) {
          throw "Background image must be the same dimensions as the canvas.";
        }
      } else {
        throw "Incorrect background parameters.";
      }

      if (p.use3DContext) {
        if (color !== undef) {
          var c = p.color.toGLArray(color);
          refreshBackground = function() {
            curContext.clearColor(c[0], c[1], c[2], c[3]);
            curContext.clear(curContext.COLOR_BUFFER_BIT | curContext.DEPTH_BUFFER_BIT);
          };
        } else {
          // Handle image background for 3d context. not done yet.
          refreshBackground = function() {};
        }
      } else { // 2d context
        if (color !== undef) {
          refreshBackground = function() {
            if (curSketch.options.isTransparent) {
              curContext.clearRect(0,0, p.width, p.height);
            }
            curContext.fillStyle = p.color.toString(color);
            curContext.fillRect(0, 0, p.width, p.height);
            isFillDirty = true;
          };
        } else {
          refreshBackground = function() {
            p.image(img, 0, 0);
          };
        }
      }
      refreshBackground();
    };

    // Draws an image to the Canvas
    p.image = function image(img, x, y, w, h) {
      if (img.width > 0) {
        var wid = w || img.width;
        var hgt = h || img.height;
        if (p.use3DContext) {
          p.beginShape(p.QUADS);
          p.texture(img.externals.canvas);
          p.vertex(x, y, 0, 0, 0);
          p.vertex(x, y+hgt, 0, 0, hgt);
          p.vertex(x+wid, y+hgt, 0, wid, hgt);
          p.vertex(x+wid, y, 0, wid, 0);
          p.endShape();
        } else {
          var bounds = imageModeConvert(x || 0, y || 0, w || img.width, h || img.height, arguments.length < 4);
          var obj = img.toImageData();

          if (img.__mask) {
            var j, size;
            if (img.__mask instanceof PImage) {
              var objMask = img.__mask.toImageData();
              for (j = 2, size = img.width * img.height * 4; j < size; j += 4) {
                // using it as an alpha channel
                obj.data[j + 1] = objMask.data[j];
                // but only the blue color channel
              }
            } else {
              for (j = 0, size = img.__mask.length; j < size; ++j) {
                obj.data[(j << 2) + 3] = img.__mask[j];
              }
            }
          }

          // draw the image
          curTint(obj);

          curContext.drawImage(getCanvasData(obj).canvas, 0, 0, img.width, img.height, bounds.x, bounds.y, bounds.w, bounds.h);
        }
      }
    };

    // Clears a rectangle in the Canvas element or the whole Canvas
    p.clear = function clear(x, y, width, height) {
      if (arguments.length === 0) {
        curContext.clearRect(0, 0, p.width, p.height);
      } else {
        curContext.clearRect(x, y, width, height);
      }
    };

    p.tint = function tint() {
      var tintColor = p.color.apply(this, arguments);
      var r = p.red(tintColor) / colorModeX;
      var g = p.green(tintColor) / colorModeY;
      var b = p.blue(tintColor) / colorModeZ;
      var a = p.alpha(tintColor) / colorModeA;

      curTint = function(obj) {
        var data = obj.data,
            length = 4 * obj.width * obj.height;
        for (var i = 0; i < length;) {
          data[i++] *= r;
          data[i++] *= g;
          data[i++] *= b;
          data[i++] *= a;
        }
      };
    };

    p.noTint = function noTint() {
      curTint = function() {};
    };

    p.copy = function copy(src, sx, sy, sw, sh, dx, dy, dw, dh) {
      if (arguments.length === 8) {
        // shift everything, and introduce p
        dh = dw;
        dw = dy;
        dy = dx;
        dx = sh;
        sh = sw;
        sw = sy;
        sy = sx;
        sx = src;
        src = p;
      }
      p.blend(src, sx, sy, sw, sh, dx, dy, dw, dh, PConstants.REPLACE);
    };

    p.blend = function blend(src, sx, sy, sw, sh, dx, dy, dw, dh, mode, pimgdest) {
      if (arguments.length === 9) {
        // shift everything, and introduce p
        mode = dh;
        dh = dw;
        dw = dy;
        dy = dx;
        dx = sh;
        sh = sw;
        sw = sy;
        sy = sx;
        sx = src;
        src = p;
      }

      var sx2 = sx + sw;
      var sy2 = sy + sh;
      var dx2 = dx + dw;
      var dy2 = dy + dh;
      var dest;
      if (src.isRemote) { // Remote images cannot access imageData
        throw "Image is loaded remotely. Cannot blend image.";
      } else {
        // check if pimgdest is there and pixels, if so this was a call from pimg.blend
        if (arguments.length === 10 || arguments.length === 9) {
          p.loadPixels();
          dest = p;
        } else if (arguments.length === 11 && pimgdest && pimgdest.imageData) {
          dest = pimgdest;
        }
        if (src === p) {
          if (p.intersect(sx, sy, sx2, sy2, dx, dy, dx2, dy2)) {
            p.blit_resize(p.get(sx, sy, sx2 - sx, sy2 - sy), 0, 0, sx2 - sx - 1, sy2 - sy - 1,
                          dest.imageData.data, dest.width, dest.height, dx, dy, dx2, dy2, mode);
          } else {
            // same as below, except skip the loadPixels() because it'd be redundant
            p.blit_resize(src, sx, sy, sx2, sy2, dest.imageData.data, dest.width, dest.height, dx, dy, dx2, dy2, mode);
          }
        } else {
          src.loadPixels();
          p.blit_resize(src, sx, sy, sx2, sy2, dest.imageData.data, dest.width, dest.height, dx, dy, dx2, dy2, mode);
        }
        if (arguments.length === 10) {
          p.updatePixels();
        }
      }
    };

    // helper function for filter()
    var buildBlurKernel = function buildBlurKernel(r) {
      var radius = p.floor(r * 3.5), i, radiusi;
      radius = (radius < 1) ? 1 : ((radius < 248) ? radius : 248);
      if (p.shared.blurRadius !== radius) {
        p.shared.blurRadius = radius;
        p.shared.blurKernelSize = 1 + (p.shared.blurRadius<<1);
        p.shared.blurKernel = new Array(p.shared.blurKernelSize);
        // init blurKernel
        for (i = 0; i < p.shared.blurKernelSize; i++) {
          p.shared.blurKernel[i] = 0;
        }

        for (i = 1, radiusi = radius - 1; i < radius; i++) {
          p.shared.blurKernel[radius+i] = p.shared.blurKernel[radiusi] = radiusi * radiusi;
        }
        p.shared.blurKernel[radius] = radius * radius;
      }
    };

    var blurARGB = function blurARGB(r, aImg) {
      var sum, cr, cg, cb, ca, c, m;
      var read, ri, ym, ymi, bk0;
      var wh = aImg.pixels.getLength();
      var r2 = new Array(wh);
      var g2 = new Array(wh);
      var b2 = new Array(wh);
      var a2 = new Array(wh);
      var yi = 0;
      var x, y, i;

      buildBlurKernel(r);

      for (y = 0; y < aImg.height; y++) {
        for (x = 0; x < aImg.width; x++) {
          cb = cg = cr = ca = sum = 0;
          read = x - p.shared.blurRadius;
          if (read<0) {
            bk0 = -read;
            read = 0;
          } else {
            if (read >= aImg.width) {
              break;
            }
            bk0=0;
          }
          for (i = bk0; i < p.shared.blurKernelSize; i++) {
            if (read >= aImg.width) {
              break;
            }
            c = aImg.pixels.getPixel(read + yi);
            m = p.shared.blurKernel[i];
            ca += m * ((c & PConstants.ALPHA_MASK) >>> 24);
            cr += m * ((c & PConstants.RED_MASK) >> 16);
            cg += m * ((c & PConstants.GREEN_MASK) >> 8);
            cb += m * (c & PConstants.BLUE_MASK);
            sum += m;
            read++;
          }
          ri = yi + x;
          a2[ri] = ca / sum;
          r2[ri] = cr / sum;
          g2[ri] = cg / sum;
          b2[ri] = cb / sum;
        }
        yi += aImg.width;
      }

      yi = 0;
      ym = -p.shared.blurRadius;
      ymi = ym*aImg.width;

      for (y = 0; y < aImg.height; y++) {
        for (x = 0; x < aImg.width; x++) {
          cb = cg = cr = ca = sum = 0;
          if (ym<0) {
            bk0 = ri = -ym;
            read = x;
          } else {
            if (ym >= aImg.height) {
              break;
            }
            bk0 = 0;
            ri = ym;
            read = x + ymi;
          }
          for (i = bk0; i < p.shared.blurKernelSize; i++) {
            if (ri >= aImg.height) {
              break;
            }
            m = p.shared.blurKernel[i];
            ca += m * a2[read];
            cr += m * r2[read];
            cg += m * g2[read];
            cb += m * b2[read];
            sum += m;
            ri++;
            read += aImg.width;
          }
          aImg.pixels.setPixel(x+yi, ((ca/sum)<<24 | (cr/sum)<<16 | (cg/sum)<<8 | (cb/sum)));
        }
        yi += aImg.width;
        ymi += aImg.width;
        ym++;
      }
    };

    // helper funtion for ERODE and DILATE modes of filter()
    var dilate = function dilate(isInverted, aImg) {
      var currIdx = 0;
      var maxIdx = aImg.pixels.getLength();
      var out = new Array(maxIdx);
      var currRowIdx, maxRowIdx, colOrig, colOut, currLum;
      var idxRight, idxLeft, idxUp, idxDown,
          colRight, colLeft, colUp, colDown,
          lumRight, lumLeft, lumUp, lumDown;

      if (!isInverted) {
        // erosion (grow light areas)
        while (currIdx<maxIdx) {
          currRowIdx = currIdx;
          maxRowIdx = currIdx + aImg.width;
          while (currIdx < maxRowIdx) {
            colOrig = colOut = aImg.pixels.getPixel(currIdx);
            idxLeft = currIdx - 1;
            idxRight = currIdx + 1;
            idxUp = currIdx - aImg.width;
            idxDown = currIdx + aImg.width;
            if (idxLeft < currRowIdx) {
              idxLeft = currIdx;
            }
            if (idxRight >= maxRowIdx) {
              idxRight = currIdx;
            }
            if (idxUp < 0) {
              idxUp = 0;
            }
            if (idxDown >= maxIdx) {
              idxDown = currIdx;
            }
            colUp = aImg.pixels.getPixel(idxUp);
            colLeft = aImg.pixels.getPixel(idxLeft);
            colDown = aImg.pixels.getPixel(idxDown);
            colRight = aImg.pixels.getPixel(idxRight);

            // compute luminance
            currLum = 77*(colOrig>>16&0xff) + 151*(colOrig>>8&0xff) + 28*(colOrig&0xff);
            lumLeft = 77*(colLeft>>16&0xff) + 151*(colLeft>>8&0xff) + 28*(colLeft&0xff);
            lumRight = 77*(colRight>>16&0xff) + 151*(colRight>>8&0xff) + 28*(colRight&0xff);
            lumUp = 77*(colUp>>16&0xff) + 151*(colUp>>8&0xff) + 28*(colUp&0xff);
            lumDown = 77*(colDown>>16&0xff) + 151*(colDown>>8&0xff) + 28*(colDown&0xff);

            if (lumLeft > currLum) {
              colOut = colLeft;
              currLum = lumLeft;
            }
            if (lumRight > currLum) {
              colOut = colRight;
              currLum = lumRight;
            }
            if (lumUp > currLum) {
              colOut = colUp;
              currLum = lumUp;
            }
            if (lumDown > currLum) {
              colOut = colDown;
              currLum = lumDown;
            }
            out[currIdx++] = colOut;
          }
        }
      } else {
        // dilate (grow dark areas)
        while (currIdx < maxIdx) {
          currRowIdx = currIdx;
          maxRowIdx = currIdx + aImg.width;
          while (currIdx < maxRowIdx) {
            colOrig = colOut = aImg.pixels.getPixel(currIdx);
            idxLeft = currIdx - 1;
            idxRight = currIdx + 1;
            idxUp = currIdx - aImg.width;
            idxDown = currIdx + aImg.width;
            if (idxLeft < currRowIdx) {
              idxLeft = currIdx;
            }
            if (idxRight >= maxRowIdx) {
              idxRight = currIdx;
            }
            if (idxUp < 0) {
              idxUp = 0;
            }
            if (idxDown >= maxIdx) {
              idxDown = currIdx;
            }
            colUp = aImg.pixels.getPixel(idxUp);
            colLeft = aImg.pixels.getPixel(idxLeft);
            colDown = aImg.pixels.getPixel(idxDown);
            colRight = aImg.pixels.getPixel(idxRight);

            // compute luminance
            currLum = 77*(colOrig>>16&0xff) + 151*(colOrig>>8&0xff) + 28*(colOrig&0xff);
            lumLeft = 77*(colLeft>>16&0xff) + 151*(colLeft>>8&0xff) + 28*(colLeft&0xff);
            lumRight = 77*(colRight>>16&0xff) + 151*(colRight>>8&0xff) + 28*(colRight&0xff);
            lumUp = 77*(colUp>>16&0xff) + 151*(colUp>>8&0xff) + 28*(colUp&0xff);
            lumDown = 77*(colDown>>16&0xff) + 151*(colDown>>8&0xff) + 28*(colDown&0xff);

            if (lumLeft < currLum) {
              colOut = colLeft;
              currLum = lumLeft;
            }
            if (lumRight < currLum) {
              colOut = colRight;
              currLum = lumRight;
            }
            if (lumUp < currLum) {
              colOut = colUp;
              currLum = lumUp;
            }
            if (lumDown < currLum) {
              colOut = colDown;
              currLum = lumDown;
            }
            out[currIdx++]=colOut;
          }
        }
      }
      aImg.pixels.set(out);
      //p.arraycopy(out,0,pixels,0,maxIdx);
    };

    p.filter = function filter(kind, param, aImg){
      var img, col, lum, i;

      if (arguments.length === 3) {
        aImg.loadPixels();
        img = aImg;
      } else {
        p.loadPixels();
        img = p;
      }

      if (param === undef) {
        param = null;
      }
      if (img.isRemote) { // Remote images cannot access imageData
        throw "Image is loaded remotely. Cannot filter image.";
      } else {
        // begin filter process
        var imglen = img.pixels.getLength();
        switch (kind) {
          case PConstants.BLUR:
            var radius = param || 1; // if no param specified, use 1 (default for p5)
            blurARGB(radius, img);
            break;

          case PConstants.GRAY:
            if (img.format === PConstants.ALPHA) { //trouble
              // for an alpha image, convert it to an opaque grayscale
              for (i = 0; i < imglen; i++) {
                col = 255 - img.pixels.getPixel(i);
                img.pixels.setPixel(i,(0xff000000 | (col << 16) | (col << 8) | col));
              }
              img.format = PConstants.RGB; //trouble
            } else {
              for (i = 0; i < imglen; i++) {
                col = img.pixels.getPixel(i);
                lum = (77*(col>>16&0xff) + 151*(col>>8&0xff) + 28*(col&0xff))>>8;
                img.pixels.setPixel(i,((col & PConstants.ALPHA_MASK) | lum<<16 | lum<<8 | lum));
              }
            }
            break;

          case PConstants.INVERT:
            for (i = 0; i < imglen; i++) {
              img.pixels.setPixel(i, (img.pixels.getPixel(i) ^ 0xffffff));
            }
            break;

          case PConstants.POSTERIZE:
            if (param === null) {
              throw "Use filter(POSTERIZE, int levels) instead of filter(POSTERIZE)";
            }
            var levels = p.floor(param);
            if ((levels < 2) || (levels > 255)) {
              throw "Levels must be between 2 and 255 for filter(POSTERIZE, levels)";
            }
            var levels1 = levels - 1;
            for (i = 0; i < imglen; i++) {
              var rlevel = (img.pixels.getPixel(i) >> 16) & 0xff;
              var glevel = (img.pixels.getPixel(i) >> 8) & 0xff;
              var blevel = img.pixels.getPixel(i) & 0xff;
              rlevel = (((rlevel * levels) >> 8) * 255) / levels1;
              glevel = (((glevel * levels) >> 8) * 255) / levels1;
              blevel = (((blevel * levels) >> 8) * 255) / levels1;
              img.pixels.setPixel(i, ((0xff000000 & img.pixels.getPixel(i)) | (rlevel << 16) | (glevel << 8) | blevel));
            }
            break;

          case PConstants.OPAQUE:
            for (i = 0; i < imglen; i++) {
              img.pixels.setPixel(i, (img.pixels.getPixel(i) | 0xff000000));
            }
            img.format = PConstants.RGB; //trouble
            break;

          case PConstants.THRESHOLD:
            if (param === null) {
              param = 0.5;
            }
            if ((param < 0) || (param > 1)) {
              throw "Level must be between 0 and 1 for filter(THRESHOLD, level)";
            }
            var thresh = p.floor(param * 255);
            for (i = 0; i < imglen; i++) {
              var max = p.max((img.pixels.getPixel(i) & PConstants.RED_MASK) >> 16, p.max((img.pixels.getPixel(i) & PConstants.GREEN_MASK) >> 8, (img.pixels.getPixel(i) & PConstants.BLUE_MASK)));
              img.pixels.setPixel(i, ((img.pixels.getPixel(i) & PConstants.ALPHA_MASK) | ((max < thresh) ? 0x000000 : 0xffffff)));
            }
            break;

          case PConstants.ERODE:
            dilate(true, img);
            break;

          case PConstants.DILATE:
            dilate(false, img);
            break;
        }
        img.updatePixels();
      }
    };


    // shared variables for blit_resize(), filter_new_scanline(), filter_bilinear(), filter()
    // change this in the future to not be exposed to p
    p.shared = {
      fracU: 0,
      ifU: 0,
      fracV: 0,
      ifV: 0,
      u1: 0,
      u2: 0,
      v1: 0,
      v2: 0,
      sX: 0,
      sY: 0,
      iw: 0,
      iw1: 0,
      ih1: 0,
      ul: 0,
      ll: 0,
      ur: 0,
      lr: 0,
      cUL: 0,
      cLL: 0,
      cUR: 0,
      cLR: 0,
      srcXOffset: 0,
      srcYOffset: 0,
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      srcBuffer: null,
      blurRadius: 0,
      blurKernelSize: 0,
      blurKernel: null
    };

    p.intersect = function intersect(sx1, sy1, sx2, sy2, dx1, dy1, dx2, dy2) {
      var sw = sx2 - sx1 + 1;
      var sh = sy2 - sy1 + 1;
      var dw = dx2 - dx1 + 1;
      var dh = dy2 - dy1 + 1;
      if (dx1 < sx1) {
        dw += dx1 - sx1;
        if (dw > sw) {
          dw = sw;
        }
      } else {
        var w = sw + sx1 - dx1;
        if (dw > w) {
          dw = w;
        }
      }
      if (dy1 < sy1) {
        dh += dy1 - sy1;
        if (dh > sh) {
          dh = sh;
        }
      } else {
        var h = sh + sy1 - dy1;
        if (dh > h) {
          dh = h;
        }
      }
      return ! (dw <= 0 || dh <= 0);
    };

    p.filter_new_scanline = function filter_new_scanline() {
      p.shared.sX = p.shared.srcXOffset;
      p.shared.fracV = p.shared.srcYOffset & PConstants.PREC_MAXVAL;
      p.shared.ifV = PConstants.PREC_MAXVAL - p.shared.fracV;
      p.shared.v1 = (p.shared.srcYOffset >> PConstants.PRECISIONB) * p.shared.iw;
      p.shared.v2 = Math.min((p.shared.srcYOffset >> PConstants.PRECISIONB) + 1, p.shared.ih1) * p.shared.iw;
    };

    p.filter_bilinear = function filter_bilinear() {
      p.shared.fracU = p.shared.sX & PConstants.PREC_MAXVAL;
      p.shared.ifU = PConstants.PREC_MAXVAL - p.shared.fracU;
      p.shared.ul = (p.shared.ifU * p.shared.ifV) >> PConstants.PRECISIONB;
      p.shared.ll = (p.shared.ifU * p.shared.fracV) >> PConstants.PRECISIONB;
      p.shared.ur = (p.shared.fracU * p.shared.ifV) >> PConstants.PRECISIONB;
      p.shared.lr = (p.shared.fracU * p.shared.fracV) >> PConstants.PRECISIONB;
      p.shared.u1 = (p.shared.sX >> PConstants.PRECISIONB);
      p.shared.u2 = Math.min(p.shared.u1 + 1, p.shared.iw1);
      // get color values of the 4 neighbouring texels
      // changed for 0.9
      var cULoffset = (p.shared.v1 + p.shared.u1) * 4;
      var cURoffset = (p.shared.v1 + p.shared.u2) * 4;
      var cLLoffset = (p.shared.v2 + p.shared.u1) * 4;
      var cLRoffset = (p.shared.v2 + p.shared.u2) * 4;
      p.shared.cUL = p.color.toInt(p.shared.srcBuffer[cULoffset], p.shared.srcBuffer[cULoffset+1],
                     p.shared.srcBuffer[cULoffset+2], p.shared.srcBuffer[cULoffset+3]);
      p.shared.cUR = p.color.toInt(p.shared.srcBuffer[cURoffset], p.shared.srcBuffer[cURoffset+1],
                     p.shared.srcBuffer[cURoffset+2], p.shared.srcBuffer[cURoffset+3]);
      p.shared.cLL = p.color.toInt(p.shared.srcBuffer[cLLoffset], p.shared.srcBuffer[cLLoffset+1],
                     p.shared.srcBuffer[cLLoffset+2], p.shared.srcBuffer[cLLoffset+3]);
      p.shared.cLR = p.color.toInt(p.shared.srcBuffer[cLRoffset], p.shared.srcBuffer[cLRoffset+1],
                     p.shared.srcBuffer[cLRoffset+2], p.shared.srcBuffer[cLRoffset+3]);
      p.shared.r = ((p.shared.ul * ((p.shared.cUL & PConstants.RED_MASK) >> 16) + p.shared.ll *
                   ((p.shared.cLL & PConstants.RED_MASK) >> 16) + p.shared.ur * ((p.shared.cUR & PConstants.RED_MASK) >> 16) +
                   p.shared.lr * ((p.shared.cLR & PConstants.RED_MASK) >> 16)) << PConstants.PREC_RED_SHIFT) & PConstants.RED_MASK;
      p.shared.g = ((p.shared.ul * (p.shared.cUL & PConstants.GREEN_MASK) + p.shared.ll * (p.shared.cLL & PConstants.GREEN_MASK) +
                   p.shared.ur * (p.shared.cUR & PConstants.GREEN_MASK) + p.shared.lr *
                   (p.shared.cLR & PConstants.GREEN_MASK)) >>> PConstants.PRECISIONB) & PConstants.GREEN_MASK;
      p.shared.b = (p.shared.ul * (p.shared.cUL & PConstants.BLUE_MASK) + p.shared.ll * (p.shared.cLL & PConstants.BLUE_MASK) +
                   p.shared.ur * (p.shared.cUR & PConstants.BLUE_MASK) + p.shared.lr * (p.shared.cLR & PConstants.BLUE_MASK)) >>> PConstants.PRECISIONB;
      p.shared.a = ((p.shared.ul * ((p.shared.cUL & PConstants.ALPHA_MASK) >>> 24) + p.shared.ll *
                   ((p.shared.cLL & PConstants.ALPHA_MASK) >>> 24) + p.shared.ur * ((p.shared.cUR & PConstants.ALPHA_MASK) >>> 24) +
                   p.shared.lr * ((p.shared.cLR & PConstants.ALPHA_MASK) >>> 24)) << PConstants.PREC_ALPHA_SHIFT) & PConstants.ALPHA_MASK;
      return p.shared.a | p.shared.r | p.shared.g | p.shared.b;
    };

    p.blit_resize = function blit_resize(img, srcX1, srcY1, srcX2, srcY2, destPixels,
                                         screenW, screenH, destX1, destY1, destX2, destY2, mode) {
      var x, y; // iterator vars
      if (srcX1 < 0) {
        srcX1 = 0;
      }
      if (srcY1 < 0) {
        srcY1 = 0;
      }
      if (srcX2 >= img.width) {
        srcX2 = img.width - 1;
      }
      if (srcY2 >= img.height) {
        srcY2 = img.height - 1;
      }
      var srcW = srcX2 - srcX1;
      var srcH = srcY2 - srcY1;
      var destW = destX2 - destX1;
      var destH = destY2 - destY1;
      var smooth = true; // may as well go with the smoothing these days
      if (!smooth) {
        srcW++;
        srcH++;
      }
      if (destW <= 0 || destH <= 0 || srcW <= 0 || srcH <= 0 || destX1 >= screenW ||
          destY1 >= screenH || srcX1 >= img.width || srcY1 >= img.height) {
        return;
      }
      var dx = Math.floor(srcW / destW * PConstants.PRECISIONF);
      var dy = Math.floor(srcH / destH * PConstants.PRECISIONF);
      p.shared.srcXOffset = Math.floor(destX1 < 0 ? -destX1 * dx : srcX1 * PConstants.PRECISIONF);
      p.shared.srcYOffset = Math.floor(destY1 < 0 ? -destY1 * dy : srcY1 * PConstants.PRECISIONF);
      if (destX1 < 0) {
        destW += destX1;
        destX1 = 0;
      }
      if (destY1 < 0) {
        destH += destY1;
        destY1 = 0;
      }
      destW = Math.min(destW, screenW - destX1);
      destH = Math.min(destH, screenH - destY1);
      // changed in 0.9, TODO
      var destOffset = destY1 * screenW + destX1;
      var destColor;
      p.shared.srcBuffer = img.imageData.data;
      if (smooth) {
        // use bilinear filtering
        p.shared.iw = img.width;
        p.shared.iw1 = img.width - 1;
        p.shared.ih1 = img.height - 1;
        switch (mode) {
        case PConstants.BLEND:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.blend(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.blend(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.ADD:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.add(destColor, p.filter_bilinear()));
              destColor = p.color.toArray(p.modes.add(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.add(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.SUBTRACT:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.subtract(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.subtract(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.LIGHTEST:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.lightest(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.lightest(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.DARKEST:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.darkest(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.darkest(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.REPLACE:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.filter_bilinear());
              //destPixels[destOffset + x] = p.filter_bilinear();
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.DIFFERENCE:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.difference(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.difference(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.EXCLUSION:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.exclusion(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.exclusion(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.MULTIPLY:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.multiply(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.multiply(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.SCREEN:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.screen(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.screen(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.OVERLAY:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.overlay(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.overlay(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.HARD_LIGHT:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.hard_light(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.hard_light(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.SOFT_LIGHT:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.soft_light(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.soft_light(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.DODGE:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.dodge(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.dodge(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        case PConstants.BURN:
          for (y = 0; y < destH; y++) {
            p.filter_new_scanline();
            for (x = 0; x < destW; x++) {
              // changed for 0.9
              destColor = p.color.toInt(destPixels[(destOffset + x) * 4],
                                        destPixels[((destOffset + x) * 4) + 1],
                                        destPixels[((destOffset + x) * 4) + 2],
                                        destPixels[((destOffset + x) * 4) + 3]);
              destColor = p.color.toArray(p.modes.burn(destColor, p.filter_bilinear()));
              //destPixels[destOffset + x] = p.modes.burn(destPixels[destOffset + x], p.filter_bilinear());
              destPixels[(destOffset + x) * 4] = destColor[0];
              destPixels[(destOffset + x) * 4 + 1] = destColor[1];
              destPixels[(destOffset + x) * 4 + 2] = destColor[2];
              destPixels[(destOffset + x) * 4 + 3] = destColor[3];
              p.shared.sX += dx;
            }
            destOffset += screenW;
            p.shared.srcYOffset += dy;
          }
          break;
        }
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Font handling
    ////////////////////////////////////////////////////////////////////////////

    // Loads a font from an SVG or Canvas API
    p.loadFont = function loadFont(name) {
      if (name.indexOf(".svg") === -1) {
        return {
          name: "\"" + name + "\", sans-serif",
          origName: name,
          width: function(str) {
            if ("measureText" in curContext) {
              return curContext.measureText(typeof str === "number" ? String.fromCharCode(str) : str).width / curTextSize;
            } else if ("mozMeasureText" in curContext) {
              return curContext.mozMeasureText(typeof str === "number" ? String.fromCharCode(str) : str) / curTextSize;
            } else {
              return 0;
            }
          }
        };
      } else {
        // If the font is a glyph, calculate by SVG table
        var font = p.loadGlyphs(name);

        return {
          name: name,
          glyph: true,
          units_per_em: font.units_per_em,
          horiz_adv_x: 1 / font.units_per_em * font.horiz_adv_x,
          ascent: font.ascent,
          descent: font.descent,
          width: function(str) {
            var width = 0;
            var len = str.length;
            for (var i = 0; i < len; i++) {
              try {
                width += parseFloat(p.glyphLook(p.glyphTable[name], str[i]).horiz_adv_x);
              }
              catch(e) {
                Processing.debug(e);
              }
            }
            return width / p.glyphTable[name].units_per_em;
          }
        };
      }
    };

    p.createFont = function(name, size, smooth, charset) {
      if (arguments.length === 2) {
        p.textSize(size);
        return p.loadFont(name);
      } else if (arguments.length === 3) {
        // smooth: true for an antialiased font, false for aliased
        p.textSize(size);
        return p.loadFont(name);
      } else if (arguments.length === 4) {
        // charset: char array containing characters to be generated
        p.textSize(size);
        return p.loadFont(name);
      } else {
        throw("incorrent number of parameters for createFont");
      }
    };

    // Sets a 'current font' for use
    p.textFont = function textFont(name, size) {
      curTextFont = name;
      p.textSize(size);
    };

    // Sets the font size
    p.textSize = function textSize(size) {
      if (size) {
        curTextSize = size;
      }
    };

    p.textAlign = function textAlign() {
      if(arguments.length === 1) {
        horizontalTextAlignment = arguments[0];
      } else if(arguments.length === 2) {
        horizontalTextAlignment = arguments[0];
        verticalTextAlignment = arguments[1];
      }
    };

    p.textWidth = function textWidth(str) {
      if (p.use3DContext) {
        if (textcanvas === undef) {
          textcanvas = document.createElement("canvas");
        }
        var oldContext = curContext;
        curContext = textcanvas.getContext("2d");
        curContext.font = curContext.mozTextStyle = curTextSize + "px " + curTextFont.name;
        if ("fillText" in curContext) {
          textcanvas.width = curContext.measureText(str).width;
        } else if ("mozDrawText" in curContext) {
          textcanvas.width = curContext.mozMeasureText(str);
        }
        curContext = oldContext;
        return textcanvas.width;
      } else {
        curContext.font = curTextSize + "px " + curTextFont.name;
        if ("fillText" in curContext) {
          return curContext.measureText(str).width;
        } else if ("mozDrawText" in curContext) {
          return curContext.mozMeasureText(str);
        }
      }
    };

    p.textAscent = (function() {
      var oldTextSize = undef,
          oldTextFont = undef,
          ascent      = undef,
          graphics    = undef;
      return function textAscent() {
        // if text size or font has changed, recalculate ascent value
        if (oldTextFont !== curTextFont || oldTextSize !== curTextSize) {
          // store current size and font
          oldTextFont = curTextFont;
          oldTextSize = curTextSize;

          var found       = false,
              character   = "k",
              colour      = p.color(0),
              top         = 0,
              bottom      = curTextSize,
              yLoc        = curTextSize/2;

          // setup off screen image to write and measure text from
          if (graphics !== undef) {
            graphics.size(curTextSize, curTextSize);
          } else {
            graphics = p.createGraphics(curTextSize, curTextSize);
          }
          graphics.background(0);
          graphics.fill(255);
          graphics.textFont(curTextFont, curTextSize);
          graphics.text(character, 0, curTextSize);

          // binary search for highest pixel
          while(yLoc !== bottom) {
            for (var xLoc = 0; xLoc < curTextSize; xLoc++) {
              if (graphics.get(xLoc, yLoc) !== colour) {
                found = true;
                xLoc = curTextSize;
              }
            }
            if (found) {
              // y--
              bottom = yLoc;
              found = false;
            } else {
              // y++
              top = yLoc;
            }
            yLoc = Math.ceil((bottom + top)/2);
          }
          ascent = ((curTextSize-1) - yLoc) + 1;
          return ascent;
        } else { // text size and font have not changed since last time
          return ascent;
        }
      };
    }());

    p.textDescent = (function() {
      var oldTextSize = undef,
          oldTextFont = undef,
          descent     = undef,
          graphics    = undef;
      return function textDescent() {
        // if text size or font has changed, recalculate descent value
        if (oldTextFont !== curTextFont || oldTextSize !== curTextSize) {
          // store current size and font
          oldTextFont = curTextFont;
          oldTextSize = curTextSize;

          var found       = false,
              character   = "p",
              colour      = p.color(0),
              top         = 0,
              bottom      = curTextSize,
              yLoc        = curTextSize/2;

          // setup off screen image to write and measure text from
          if (graphics !== undef) {
            graphics.size(curTextSize, curTextSize);
          } else {
            graphics = p.createGraphics(curTextSize, curTextSize);
          }
          graphics.background(0);
          graphics.fill(255);
          graphics.textFont(curTextFont, curTextSize);
          graphics.text(character, 0, 0);

          // binary search for lowest pixel
          while(yLoc !== bottom) {
            for (var xLoc = 0; xLoc < curTextSize; xLoc++) {
              if (graphics.get(xLoc, yLoc) !== colour) {
                found = true;
                xLoc = curTextSize;
              }
            }
            if (found) {
              // y++
              top = yLoc;
              found = false;
            } else {
              // y--
              bottom = yLoc;
            }
            yLoc = Math.ceil((bottom + top)/2);
          }
          descent = yLoc + 1;
          return descent;
        } else { // text size and font have not changed since last time
          return descent;
        }
      };
    }());

    // A lookup table for characters that can not be referenced by Object
    p.glyphLook = function glyphLook(font, chr) {
      try {
        switch (chr) {
        case "1":
          return font.one;
        case "2":
          return font.two;
        case "3":
          return font.three;
        case "4":
          return font.four;
        case "5":
          return font.five;
        case "6":
          return font.six;
        case "7":
          return font.seven;
        case "8":
          return font.eight;
        case "9":
          return font.nine;
        case "0":
          return font.zero;
        case " ":
          return font.space;
        case "$":
          return font.dollar;
        case "!":
          return font.exclam;
        case '"':
          return font.quotedbl;
        case "#":
          return font.numbersign;
        case "%":
          return font.percent;
        case "&":
          return font.ampersand;
        case "'":
          return font.quotesingle;
        case "(":
          return font.parenleft;
        case ")":
          return font.parenright;
        case "*":
          return font.asterisk;
        case "+":
          return font.plus;
        case ",":
          return font.comma;
        case "-":
          return font.hyphen;
        case ".":
          return font.period;
        case "/":
          return font.slash;
        case "_":
          return font.underscore;
        case ":":
          return font.colon;
        case ";":
          return font.semicolon;
        case "<":
          return font.less;
        case "=":
          return font.equal;
        case ">":
          return font.greater;
        case "?":
          return font.question;
        case "@":
          return font.at;
        case "[":
          return font.bracketleft;
        case "\\":
          return font.backslash;
        case "]":
          return font.bracketright;
        case "^":
          return font.asciicircum;
        case "`":
          return font.grave;
        case "{":
          return font.braceleft;
        case "|":
          return font.bar;
        case "}":
          return font.braceright;
        case "~":
          return font.asciitilde;
          // If the character is not 'special', access it by object reference
        default:
          return font[chr];
        }
      } catch(e) {
        Processing.debug(e);
      }
    };

    function toP5String(obj) {
      if(obj instanceof String) {
        return obj;
      } else if(typeof obj === 'number') {
        // check if an int
        if(obj === (0 | obj)) {
          return obj.toString();
        } else {
          return p.nf(obj, 0, 3);
        }
      } else if(obj === null || obj === undef) {
        return "";
      } else {
        return obj.toString();
      }
    }

    // Print some text to the Canvas
    function text$line(str, x, y, z, align) {
      var textWidth = 0, xOffset = 0;
      // If the font is a standard Canvas font...
      if (!curTextFont.glyph) {
        if (str && ("fillText" in curContext || "mozDrawText" in curContext)) {
          curContext.font = curContext.mozTextStyle = curTextSize + "px " + curTextFont.name;

          if (isFillDirty) {
            curContext.fillStyle = p.color.toString(currentFillColor);
            isFillDirty = false;
          }

          // horizontal offset/alignment
          if(align === PConstants.RIGHT || align === PConstants.CENTER) {
            if ("fillText" in curContext) {
              textWidth = curContext.measureText(str).width;
            } else if ("mozDrawText" in curContext) {
              textWidth = curContext.mozMeasureText(str);
            }

            if(align === PConstants.RIGHT) {
              xOffset = -textWidth;
            } else { // if(align === PConstants.CENTER)
              xOffset = -textWidth/2;
            }
          }

          if ("fillText" in curContext) {
            curContext.fillText(str, x+xOffset, y);
          } else if ("mozDrawText" in curContext) {
            saveContext();
            curContext.translate(x+xOffset, y);
            curContext.mozDrawText(str);
            restoreContext();
          }
        }
      } else {
        // If the font is a Batik SVG font...
        var font = p.glyphTable[curTextFont.name];
        saveContext();
        curContext.translate(x, y + curTextSize);

        // horizontal offset/alignment
        if(align === PConstants.RIGHT || align === PConstants.CENTER) {
          textWidth = font.width(str);

          if(align === PConstants.RIGHT) {
            xOffset = -textWidth;
          } else { // if(align === PConstants.CENTER)
            xOffset = -textWidth/2;
          }
        }

        var upem   = font.units_per_em,
          newScale = 1 / upem * curTextSize;

        curContext.scale(newScale, newScale);

        for (var i=0, len=str.length; i < len; i++) {
          // Test character against glyph table
          try {
            p.glyphLook(font, str[i]).draw();
          } catch(e) {
            Processing.debug(e);
          }
        }
        restoreContext();
      }
    }

    function text$line$3d(str, x, y, z, align) {
      // handle case for 3d text
      if (textcanvas === undef) {
        textcanvas = document.createElement("canvas");
      }
      var oldContext = curContext;
      curContext = textcanvas.getContext("2d");
      curContext.font = curContext.mozTextStyle = curTextSize + "px " + curTextFont.name;
      var textWidth = 0;
      if ("fillText" in curContext) {
        textWidth = curContext.measureText(str).width;
      } else if ("mozDrawText" in curContext) {
        textWidth = curContext.mozMeasureText(str);
      }
      textcanvas.width = textWidth;
      textcanvas.height = curTextSize;
      curContext = textcanvas.getContext("2d"); // refreshes curContext
      curContext.font = curContext.mozTextStyle = curTextSize + "px " + curTextFont.name;
      curContext.textBaseline="top";

      // paint on 2D canvas
      text$line(str,0,0,0,PConstants.LEFT);

      // use it as a texture
      var aspect = textcanvas.width/textcanvas.height;
      curContext = oldContext;

      executeTexImage2D(textcanvas);
      curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_MAG_FILTER, curContext.LINEAR);
      curContext.texParameteri(curContext.TEXTURE_2D, curContext.TEXTURE_MIN_FILTER, curContext.LINEAR_MIPMAP_LINEAR);
      curContext.generateMipmap(curContext.TEXTURE_2D);

      // horizontal offset/alignment
      var xOffset = 0;
      if (align === PConstants.RIGHT) {
        xOffset = -textWidth;
      } else if(align === PConstants.CENTER) {
        xOffset = -textWidth/2;
      }
      var model = new PMatrix3D();
      var scalefactor = curTextSize * 0.5;
      model.translate(x+xOffset-scalefactor/2, y-scalefactor, z);
      model.scale(-aspect*scalefactor, -scalefactor, scalefactor);
      model.translate(-1, -1, -1);
      model.transpose();

      var view = new PMatrix3D();
      view.scale(1, -1, 1);
      view.apply(modelView.array());
      view.transpose();

      var proj = new PMatrix3D();
      proj.set(projection);
      proj.transpose();

      curContext.useProgram(programObject2D);
      vertexAttribPointer(programObject2D, "Vertex", 3, textBuffer);
      vertexAttribPointer(programObject2D, "aTextureCoord", 2, textureBuffer);
      uniformi(programObject2D, "uSampler", [0]);
      uniformi(programObject2D, "picktype", 1);
      uniformMatrix(programObject2D, "model", false,  model.array());
      uniformMatrix(programObject2D, "view", false, view.array());
      uniformMatrix(programObject2D, "projection", false, proj.array());
      uniformf(programObject2D, "color", fillStyle);
      curContext.bindBuffer(curContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
      curContext.drawElements(curContext.TRIANGLES, 6, curContext.UNSIGNED_SHORT, 0);
    }

    function text$4(str, x, y, z) {
      var lineFunction = p.use3DContext ?  text$line$3d : text$line;
      var lines, linesCount;
      if(str.indexOf('\n') < 0) {
        lines = [str];
        linesCount = 1;
      } else {
        lines = str.split(/\r?\n/g);
        linesCount = lines.length;
      }
      // handle text line-by-line

      var yOffset;
      if(verticalTextAlignment === PConstants.TOP) {
        yOffset = (1-baselineOffset) * curTextSize;
      } else if(verticalTextAlignment === PConstants.CENTER) {
        yOffset = (1-baselineOffset - linesCount/2) * curTextSize;
      } else if(verticalTextAlignment === PConstants.BOTTOM) {
        yOffset = (1-baselineOffset - linesCount) * curTextSize;
      } else { //  if(verticalTextAlignment === PConstants.BASELINE) {
        yOffset = (1 - linesCount) * curTextSize;
      }
      for(var i=0;i<linesCount;++i) {
        var line = lines[i];
        lineFunction(line, x, y + yOffset, z, horizontalTextAlignment);
        yOffset += curTextSize;
      }
    }

    function text$6(str, x, y, width, height, z) {
      if (str.length === 0) { // is empty string
        return;
      }
      if(curTextSize > height) { // is text height larger than box
        return;
      }

      var spaceMark = -1;
      var start = 0;
      var lineWidth = 0;
      var textboxWidth = width;

      var yOffset = 0;

      curContext.font = curTextSize + "px " + curTextFont.name;

      var drawCommands = [];
      var hadSpaceBefore = false;
      for (var j=0, len=str.length; j < len; j++) {
        var currentChar = str[j];
        var letterWidth;

        if ("fillText" in curContext) {
          letterWidth = curContext.measureText(currentChar).width;
        } else if ("mozDrawText" in curContext) {
          letterWidth = curContext.mozMeasureText(currentChar);
        }

        if (currentChar !== "\n" && (currentChar === " " || (hadSpaceBefore && str[j + 1] === " ") ||
            lineWidth + 2 * letterWidth < textboxWidth)) { // check a line of text
          if (currentChar === " ") {
            spaceMark = j;
          }
          lineWidth += letterWidth;
        } else { // draw a line of text
          if (start === spaceMark + 1) { // in case a whole line without a space
            spaceMark = j;
          }

          if (str[j] === "\n") {
            drawCommands.push({text:str.substring(start, j), width: lineWidth, offset: yOffset});
            start = j + 1;
          } else {
            drawCommands.push({text:str.substring(start, spaceMark + 1), width: lineWidth, offset: yOffset});
            start = spaceMark + 1;
          }
          yOffset += curTextSize;

          lineWidth = 0;
          j = start - 1;
        }
        hadSpaceBefore = currentChar === " ";
      } // for (var j=

      if (start < len) { // draw the last line
        drawCommands.push({text:str.substring(start), width: lineWidth, offset: yOffset});
        yOffset += curTextSize;
      }

      // actual draw
      var lineFunction = p.use3DContext ?  text$line$3d : text$line;
      var xOffset = 0;
      if (horizontalTextAlignment === PConstants.CENTER) {
        xOffset = width / 2;
      } else if (horizontalTextAlignment === PConstants.RIGHT) {
        xOffset = width;
      }

      // offsets for alignment
      var boxYOffset1 = (1-baselineOffset) * curTextSize, boxYOffset2 = 0;
      if (verticalTextAlignment === PConstants.BOTTOM) {
        boxYOffset2 = height-yOffset;
      } else if (verticalTextAlignment === PConstants.CENTER) {
        boxYOffset2 = (height-yOffset) / 2;
      }

      for (var il=0,ll=drawCommands.length; il<ll; ++il) {
        var command = drawCommands[il];
        if (command.offset + boxYOffset2 < 0) {
          continue; // skip if not inside box yet
        }
        if (command.offset + boxYOffset2 + curTextSize > height) {
          break; // stop if no enough space for one more line draw
        }
        lineFunction(command.text, x + xOffset, y + command.offset + boxYOffset1 + boxYOffset2, z, horizontalTextAlignment);
      }
    }

    p.text = function text() {
      if (tMode === PConstants.SCREEN) {  // TODO: 3D Screen not working yet due to 3D not working in textAscent
        p.pushMatrix();
        p.resetMatrix();
        var asc = p.textAscent();
        var des = p.textDescent();
        var tWidth = p.textWidth(arguments[0]);
        var tHeight = asc + des;
        var font = p.loadFont(curTextFont.origName);
        var hud = p.createGraphics(tWidth, tHeight);
        hud.beginDraw();
        hud.fill(currentFillColor);
        hud.opaque = false;
        hud.background(0, 0, 0, 0);
        hud.textFont(font);
        hud.textSize(curTextSize);
        hud.text(arguments[0], 0, asc);
        hud.endDraw();
        if (arguments.length === 5 || arguments.length === 6) {
          p.image(hud, arguments[1], arguments[2]-asc, arguments[3], arguments[4]);
        } else {
          p.image(hud, arguments[1], arguments[2]-asc);
        }
        p.popMatrix();
      }
      else if (tMode === PConstants.SHAPE) {
        // TODO: requires beginRaw function
      } else {
        if (arguments.length === 3) { // for text( str, x, y)
          text$4(toP5String(arguments[0]), arguments[1], arguments[2], 0);
        } else if (arguments.length === 4) { // for text( str, x, y, z)
          text$4(toP5String(arguments[0]), arguments[1], arguments[2], arguments[3]);
        } else if (arguments.length === 5) { // for text( str, x, y , width, height)
          text$6(toP5String(arguments[0]), arguments[1], arguments[2], arguments[3], arguments[4], 0);
        } else if (arguments.length === 6) { // for text( stringdata, x, y , width, height, z)
          text$6(toP5String(arguments[0]), arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
      }
    };

    p.textMode = function textMode(mode){
      tMode = mode;
    };

    // Load Batik SVG Fonts and parse to pre-def objects for quick rendering
    p.loadGlyphs = function loadGlyph(url) {
      var x, y, cx, cy, nx, ny, d, a, lastCom, lenC, horiz_adv_x, getXY = '[0-9\\-]+', path;

      // Return arrays of SVG commands and coords
      // get this to use p.matchAll() - will need to work around the lack of null return
      var regex = function regex(needle, hay) {
        var i = 0,
          results = [],
          latest, regexp = new RegExp(needle, "g");
        latest = results[i] = regexp.exec(hay);
        while (latest) {
          i++;
          latest = results[i] = regexp.exec(hay);
        }
        return results;
      };

      var buildPath = function buildPath(d) {
        var c = regex("[A-Za-z][0-9\\- ]+|Z", d);

        // Begin storing path object
        path = "var path={draw:function(){saveContext();curContext.beginPath();";

        x = 0;
        y = 0;
        cx = 0;
        cy = 0;
        nx = 0;
        ny = 0;
        d = 0;
        a = 0;
        lastCom = "";
        lenC = c.length - 1;

        // Loop through SVG commands translating to canvas eqivs functions in path object
        for (var j = 0; j < lenC; j++) {
          var com = c[j][0], xy = regex(getXY, com);

          switch (com[0]) {
            case "M":
              //curContext.moveTo(x,-y);
              x = parseFloat(xy[0][0]);
              y = parseFloat(xy[1][0]);
              path += "curContext.moveTo(" + x + "," + (-y) + ");";
              break;

            case "L":
              //curContext.lineTo(x,-y);
              x = parseFloat(xy[0][0]);
              y = parseFloat(xy[1][0]);
              path += "curContext.lineTo(" + x + "," + (-y) + ");";
              break;

            case "H":
              //curContext.lineTo(x,-y)
              x = parseFloat(xy[0][0]);
              path += "curContext.lineTo(" + x + "," + (-y) + ");";
              break;

            case "V":
              //curContext.lineTo(x,-y);
              y = parseFloat(xy[0][0]);
              path += "curContext.lineTo(" + x + "," + (-y) + ");";
              break;

            case "T":
              //curContext.quadraticCurveTo(cx,-cy,nx,-ny);
              nx = parseFloat(xy[0][0]);
              ny = parseFloat(xy[1][0]);

              if (lastCom === "Q" || lastCom === "T") {
                d = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(cy - y, 2));
                a = Math.PI + Math.atan2(cx - x, cy - y);
                cx = x + (Math.sin(a) * (d));
                cy = y + (Math.cos(a) * (d));
              } else {
                cx = x;
                cy = y;
              }

              path += "curContext.quadraticCurveTo(" + cx + "," + (-cy) + "," + nx + "," + (-ny) + ");";
              x = nx;
              y = ny;
              break;

            case "Q":
              //curContext.quadraticCurveTo(cx,-cy,nx,-ny);
              cx = parseFloat(xy[0][0]);
              cy = parseFloat(xy[1][0]);
              nx = parseFloat(xy[2][0]);
              ny = parseFloat(xy[3][0]);
              path += "curContext.quadraticCurveTo(" + cx + "," + (-cy) + "," + nx + "," + (-ny) + ");";
              x = nx;
              y = ny;
              break;

            case "Z":
              //curContext.closePath();
              path += "curContext.closePath();";
              break;
          }
          lastCom = com[0];
        }

        path += "executeContextFill();executeContextStroke();";
        path += "restoreContext();";
        path += "curContext.translate(" + horiz_adv_x + ",0);";
        path += "}}";

        return path;
      };

      // Parse SVG font-file into block of Canvas commands
      var parseSVGFont = function parseSVGFontse(svg) {
        // Store font attributes
        var font = svg.getElementsByTagName("font");
        p.glyphTable[url].horiz_adv_x = font[0].getAttribute("horiz-adv-x");

        var font_face = svg.getElementsByTagName("font-face")[0];
        p.glyphTable[url].units_per_em = parseFloat(font_face.getAttribute("units-per-em"));
        p.glyphTable[url].ascent = parseFloat(font_face.getAttribute("ascent"));
        p.glyphTable[url].descent = parseFloat(font_face.getAttribute("descent"));

        var glyph = svg.getElementsByTagName("glyph"),
          len = glyph.length;

        // Loop through each glyph in the SVG
        for (var i = 0; i < len; i++) {
          // Store attributes for this glyph
          var unicode = glyph[i].getAttribute("unicode");
          var name = glyph[i].getAttribute("glyph-name");
          horiz_adv_x = glyph[i].getAttribute("horiz-adv-x");
          if (horiz_adv_x === null) {
            horiz_adv_x = p.glyphTable[url].horiz_adv_x;
          }
          d = glyph[i].getAttribute("d");
          // Split path commands in glpyh
          if (d !== undef) {
            path = buildPath(d);
            eval(path);
            // Store glyph data to table object
            p.glyphTable[url][name] = {
              name: name,
              unicode: unicode,
              horiz_adv_x: horiz_adv_x,
              draw: path.draw
            };
          }
        } // finished adding glyphs to table
      };

      // Load and parse Batik SVG font as XML into a Processing Glyph object
      var loadXML = function loadXML() {
        var xmlDoc;

        try {
          xmlDoc = document.implementation.createDocument("", "", null);
        }
        catch(e_fx_op) {
          Processing.debug(e_fx_op.message);
          return;
        }

        try {
          xmlDoc.async = false;
          xmlDoc.load(url);
          parseSVGFont(xmlDoc.getElementsByTagName("svg")[0]);
        }
        catch(e_sf_ch) {
          // Google Chrome, Safari etc.
          Processing.debug(e_sf_ch);
          try {
            var xmlhttp = new window.XMLHttpRequest();
            xmlhttp.open("GET", url, false);
            xmlhttp.send(null);
            parseSVGFont(xmlhttp.responseXML.documentElement);
          }
          catch(e) {
            Processing.debug(e_sf_ch);
          }
        }
      };

      // Create a new object in glyphTable to store this font
      p.glyphTable[url] = {};

      // Begin loading the Batik SVG font...
      loadXML(url);

      // Return the loaded font for attribute grabbing
      return p.glyphTable[url];
    };

    ////////////////////////////////////////////////////////////////////////////
    // Class methods
    ////////////////////////////////////////////////////////////////////////////

    p.extendClass = function extendClass(subClass, baseClass) {
      function extendGetterSetter(propertyName) {
        p.defineProperty(subClass, propertyName, {
          get: function() {
            return baseClass[propertyName];
          },
          set: function(v) {
            baseClass[propertyName]=v;
          }
        });
      }

      for (var propertyName in baseClass) {
        if (subClass[propertyName] === undef) {
          if (typeof baseClass[propertyName] === 'function') {
            subClass[propertyName] = baseClass[propertyName];
          } else {
            extendGetterSetter(propertyName);
          }
        }
      }
    };

    p.addMethod = function addMethod(object, name, fn, superAccessor) {
      if (object[name]) {
        var args = fn.length,
          oldfn = object[name];

        object[name] = function() {
          if (arguments.length === args) {
            return fn.apply(this, arguments);
          } else {
            return oldfn.apply(this, arguments);
          }
        };
      } else {
        object[name] = fn;
      }
    };

    //////////////////////////////////////////////////////////////////////////
    // Event handling
    //////////////////////////////////////////////////////////////////////////

    function attach(elem, type, fn) {
      if (elem.addEventListener) {
        elem.addEventListener(type, fn, false);
      } else {
        elem.attachEvent("on" + type, fn);
      }
      eventHandlers.push([elem, type, fn]);
    }

    attach(curElement, "mousemove", function(e) {
      var element = curElement, offsetX = 0, offsetY = 0;

      p.pmouseX = p.mouseX;
      p.pmouseY = p.mouseY;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      // Dropping support for IE clientX and clientY, switching to pageX and pageY so we don't have to calculate scroll offset.
      // Removed in ticket #184. See rev: 2f106d1c7017fed92d045ba918db47d28e5c16f4
      p.mouseX = e.pageX - offsetX;
      p.mouseY = e.pageY - offsetY;

      if (typeof p.mouseMoved === "function" && !p.__mousePressed) {
        p.mouseMoved();
      }
      if (typeof p.mouseDragged === "function" && p.__mousePressed) {
        p.mouseDragged();
        p.mouseDragging = true;
      }
    });

    attach(curElement, "mouseout", function(e) {
    });

    attach(curElement, "mousedown", function(e) {
      p.__mousePressed = true;
      p.mouseDragging = false;
      switch (e.which) {
      case 1:
        p.mouseButton = PConstants.LEFT;
        break;
      case 2:
        p.mouseButton = PConstants.CENTER;
        break;
      case 3:
        p.mouseButton = PConstants.RIGHT;
        break;
      }

      if (typeof p.mousePressed === "function") {
        p.mousePressed();
      }
    });

    attach(curElement, "mouseup", function(e) {
      p.__mousePressed = false;

      if (typeof p.mouseClicked === "function" && !p.mouseDragging) {
        p.mouseClicked();
      }

      if (typeof p.mouseReleased === "function") {
        p.mouseReleased();
      }
    });

    var mouseWheelHandler = function(e) {
      var delta = 0;

      if (e.wheelDelta) {
        delta = e.wheelDelta / 120;
        if (window.opera) {
          delta = -delta;
        }
      } else if (e.detail) {
        delta = -e.detail / 3;
      }

      p.mouseScroll = delta;

      if (delta && typeof p.mouseScrolled === 'function') {
        p.mouseScrolled();
      }
    };

    // Support Gecko and non-Gecko scroll events
    attach(document, 'DOMMouseScroll', mouseWheelHandler);
    attach(document, 'mousewheel', mouseWheelHandler);

    //////////////////////////////////////////////////////////////////////////
    // Keyboard Events
    //////////////////////////////////////////////////////////////////////////

    function keyCodeMap(code, shift) {
      // Letters
      if (code >= 65 && code <= 90) { // A-Z
        // Keys return ASCII for upcased letters.
        // Convert to downcase if shiftKey is not pressed.
        if (shift) {
          return code;
        }
        else {
          return code + 32;
        }
      }

      // Numbers and their shift-symbols
      else if (code >= 48 && code <= 57) { // 0-9
        if (shift) {
          switch (code) {
          case 49:
            return 33; // !
          case 50:
            return 64; // @
          case 51:
            return 35; // #
          case 52:
            return 36; // $
          case 53:
            return 37; // %
          case 54:
            return 94; // ^
          case 55:
            return 38; // &
          case 56:
            return 42; // *
          case 57:
            return 40; // (
          case 48:
            return 41; // )
          }
        }
      }

      // Coded keys
      else if (codedKeys.indexOf(code) >= 0) { // SHIFT, CONTROL, ALT, LEFT, RIGHT, UP, DOWN
        p.keyCode = code;
        return PConstants.CODED;
      }

      // Symbols and their shift-symbols
      else {
        if (shift) {
          switch (code) {
          case 107:
            return 43; // +
          case 219:
            return 123; // {
          case 221:
            return 125; // }
          case 222:
            return 34; // "
          }
        } else {
          switch (code) {
          case 188:
            return 44; // ,
          case 109:
            return 45; // -
          case 190:
            return 46; // .
          case 191:
            return 47; // /
          case 192:
            return 96; // ~
          case 219:
            return 91; // [
          case 220:
            return 92; // \
          case 221:
            return 93; // ]
          case 222:
            return 39; // '
          }
        }
      }
      return code;
    }

    attach(document, "keydown", function(e) {
      p.__keyPressed = true;
      p.keyCode = null;
      p.key = keyCodeMap(e.keyCode, e.shiftKey);

      if (typeof p.keyPressed === "function") {
        p.keyPressed();
      }
    });

    attach(document, "keyup", function(e) {
      p.keyCode = null;
      p.key = keyCodeMap(e.keyCode, e.shiftKey);

      //TODO: This needs to only be made false if all keys have been released.
      p.__keyPressed = false;

      if (typeof p.keyReleased === "function") {
        p.keyReleased();
      }
    });

    attach(document, "keypress", function (e) {
      // In Firefox, e.keyCode is not currently set with keypress.
      //
      // keypress will always happen after a keydown, so p.keyCode and p.key
      // should remain correct. Some browsers (chrome) refire keydown when
      // key repeats happen, others (firefox) don't. Either way keyCode and
      // key should remain correct.

      if (p.keyTyped) {
        p.keyTyped();
      }
    });

    // Place-holder for debugging function
    Processing.debug = function(e) {};

    // Get the DOM element if string was passed
    if (typeof curElement === "string") {
      curElement = document.getElementById(curElement);
    }

    // Send aCode Processing syntax to be converted to JavaScript
    if (aCode) {
      if(aCode instanceof Processing.Sketch) {
        // Use sketch as is
        curSketch = aCode;
      } else if(typeof aCode === "function") {
        // Wrap function with default sketch parameters
        curSketch = new Processing.Sketch(aCode);
      } else {
        // Compile the code
        curSketch = Processing.compile(aCode);
      }

      // Expose internal field for diagnostics and testing
      p.externals.sketch = curSketch;

      p.use3DContext = curSketch.use3DContext;

      if ("mozOpaque" in curElement) {
        curElement.mozOpaque = !curSketch.options.isTransparent;
      }

      // Initialize the onfocus and onblur event handler externals
      if (curSketch.options.pauseOnBlur) {
        p.externals.onfocus = function() {
          if (doLoop) {
            p.loop();
          }
        };

        p.externals.onblur = function() {
          if (doLoop && loopStarted) {
            p.noLoop();
            doLoop = true; // make sure to keep this true after the noLoop call
          }
        };
      }

      if (!curSketch.use3DContext) {
        // Setup default 2d canvas context.
        curContext = curElement.getContext('2d');

        // Externalize the default context
        p.externals.context = curContext;

        modelView = new PMatrix2D();

        // Canvas has trouble rendering single pixel stuff on whole-pixel
        // counts, so we slightly offset it (this is super lame).
        curContext.translate(0.5, 0.5);

        curContext.lineCap = 'round';

        // Set default stroke and fill color
        p.stroke(0);
        p.fill(255);
        p.noSmooth();
        p.disableContextMenu();
      }

      // Step through the libraries that were attached at doc load...
      for (var i in Processing.lib) {
        if (Processing.lib.hasOwnProperty(i)) {
          // Init the libraries in the context of this p_instance
          Processing.lib[i].call(this);
        }
      }

      var executeSketch = function(processing) {
        // Don't start until all specified images and fonts in the cache are preloaded
        if (!curSketch.imageCache.pending && curSketch.fonts.pending()) {
          curSketch.attach(processing, PConstants);

          // Run void setup()
          if (processing.setup) {
            processing.setup();
          }

          // some pixels can be cached, flushing
          resetContext();

          if (processing.draw) {
            if (!doLoop) {
              processing.redraw();
            } else {
              processing.loop();
            }
          }
        } else {
          window.setTimeout(function() { executeSketch(processing); }, 10);
        }
      };

      // The parser adds custom methods to the processing context
      // this renames p to processing so these methods will run
      executeSketch(p);
    } else {
      // No executable sketch was specified
      // or called via createGraphics
      curSketch = new Processing.Sketch();
      curSketch.options.isTransparent = true;
    }

  };

  // Processing global methods and constants for the parser
  function getGlobalMembers() {
    var names = [ /* this code is generated by jsglobals.js */
      "abs", "acos", "alpha", "ambient", "ambientLight", "append", "applyMatrix",
      "arc", "arrayCopy", "ArrayList", "asin", "atan", "atan2", "background",
      "beginCamera", "beginDraw", "beginShape", "bezier", "bezierDetail",
      "bezierPoint", "bezierTangent", "bezierVertex", "binary", "blend",
      "blendColor", "blit_resize", "blue", "boolean", "box", "breakShape",
      "brightness", "byte", "camera", "ceil", "char", "Character", "clear",
      "color", "colorMode", "concat", "console", "constrain", "copy", "cos",
      "createFont", "createGraphics", "createImage", "cursor", "curve",
      "curveDetail", "curvePoint", "curveTangent", "curveTightness",
      "curveVertex", "day", "defaultColor", "degrees", "directionalLight",
      "disableContextMenu", "dist", "draw", "ellipse", "ellipseMode", "emissive",
      "enableContextMenu", "endCamera", "endDraw", "endShape", "exit", "exp",
      "expand", "externals", "fill", "filter", "filter_bilinear",
      "filter_new_scanline", "float", "floor", "focused", "frameCount",
      "frameRate", "frustum", "get", "glyphLook", "glyphTable", "green",
      "HashMap", "height", "hex", "hint", "hour", "hue", "image", "imageMode",
      "Import", "int", "intersect", "join", "key", "keyCode", "keyPressed",
      "keyReleased", "keyTyped", "lerp", "lerpColor", "lightFalloff", "lights",
      "lightSpecular", "line", "link", "loadBytes", "loadFont", "loadGlyphs",
      "loadImage", "loadPixels", "loadShape", "loadStrings", "log", "loop",
      "mag", "map", "match", "matchAll", "max", "millis", "min", "minute", "mix",
      "modelX", "modelY", "modelZ", "modes", "month", "mouseButton",
      "mouseClicked", "mouseDragged", "mouseMoved", "mousePressed",
      "mouseReleased", "mouseScroll", "mouseScrolled", "mouseX", "mouseY",
      "name", "nf", "nfc", "nfp", "nfs", "noCursor", "noFill", "noise",
      "noiseDetail", "noiseSeed", "noLights", "noLoop", "norm", "normal",
      "noSmooth", "noStroke", "noTint", "ortho", "peg", "perspective", "PImage",
      "pixels", "PMatrix2D", "PMatrix3D", "PMatrixStack", "pmouseX", "pmouseY",
      "point", "pointLight", "popMatrix", "popStyle", "pow", "print",
      "printCamera", "println", "printMatrix", "printProjection", "PShape",
      "pushMatrix", "pushStyle", "PVector", "quad", "radians", "random",
      "Random", "randomSeed", "rect", "rectMode", "red", "redraw",
      "requestImage", "resetMatrix", "reverse", "rotate", "rotateX", "rotateY",
      "rotateZ", "round", "saturation", "save", "saveStrings", "scale",
      "screenX", "screenY", "screenZ", "second", "set", "setup", "shape",
      "shapeMode", "shared", "shininess", "shorten", "sin", "size", "smooth",
      "sort", "specular", "sphere", "sphereDetail", "splice", "split",
      "splitTokens", "spotLight", "sq", "sqrt", "status", "str", "stroke",
      "strokeCap", "strokeJoin", "strokeWeight", "subset", "tan", "text",
      "textAlign", "textAscent", "textDescent", "textFont", "textMode",
      "textSize", "texture", "textureMode", "textWidth", "tint", "translate",
      "triangle", "trim", "unbinary", "unhex", "updatePixels", "use3DContext",
      "vertex", "width", "XMLElement", "year", "__frameRate", "__keyPressed",
      "__mousePressed"];

    var members = {};
    var i, l;
    for (i = 0, l = names.length; i < l ; ++i) {
      members[names[i]] = null;
    }
    for (var lib in Processing.lib) {
      if (Processing.lib.hasOwnProperty(lib)) {
        if (Processing.lib[lib].exports) {
          var exportedNames = Processing.lib[lib].exports;
          for (i = 0, l = exportedNames.length; i < l; ++i) {
           members[exportedNames[i]] = null;
          }
        }
      }
    }
    return members;
  }

  // Parser starts
  function parseProcessing(code) {
    var globalMembers = getGlobalMembers();

    function splitToAtoms(code) {
      var atoms = [];
      var items = code.split(/([\{\[\(\)\]\}])/);
      var result = items[0];

      var stack = [];
      for(var i=1; i < items.length; i += 2) {
        var item = items[i];
        if(item === '[' || item === '{' || item === '(') {
          stack.push(result); result = item;
        } else if(item === ']' || item === '}' || item === ')') {
          var kind = item === '}' ? 'A' : item === ')' ? 'B' : 'C';
          var index = atoms.length; atoms.push(result + item);
          result = stack.pop() + '"' + kind + (index + 1) + '"';
        }
        result += items[i + 1];
      }
      atoms.unshift(result);
      return atoms;
    }

    function injectStrings(code, strings) {
      return code.replace(/'(\d+)'/g, function(all, index) {
        var val = strings[index];
        if(val.charAt(0) === "/") {
          return val;
        } else {
          return (/^'((?:[^'\\\n])|(?:\\.[0-9A-Fa-f]*))'$/).test(val) ? "(new processing.Character(" + val + "))" : val;
        }
      });
    }

    function trimSpaces(string) {
      var m1 = /^\s*/.exec(string), result;
      if(m1[0].length === string.length) {
        result = {left: m1[0], middle: "", right: ""};
      } else {
        var m2 = /\s*$/.exec(string);
        result = {left: m1[0], middle: string.substring(m1[0].length, m2.index), right: m2[0]};
      }
      result.untrim = function(t) { return this.left + t + this.right; };
      return result;
    }

    function trim(string) {
      return string.replace(/^\s+/,'').replace(/\s+$/,'');
    }

    function appendToLookupTable(table, array) {
      for(var i=0,l=array.length;i<l;++i) {
        table[array[i]] = null;
      }
      return table;
    }

    function isLookupTableEmpty(table) {
      for(var i in table) {
        if(table.hasOwnProperty(i)) {
          return false;
        }
      }
      return true;
    }

    function getAtomIndex(templ) { return templ.substring(2, templ.length - 1); }

    var codeWoExtraCr = code.replace(/\r\n?|\n\r/g, "\n");

    var strings = [];
    var codeWoStrings = codeWoExtraCr.replace(/("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(([\[\(=|&!\^:?]\s*)(\/(?![*\/])(?:[^\/\\\n]|\\.)*\/[gim]*)\b)|(\/\/[^\n]*\n)|(\/\*(?:(?!\*\/)(?:.|\n))*\*\/)/g,
    function(all, quoted, aposed, regexCtx, prefix, regex, singleComment, comment) {
      var index;
      if(quoted || aposed) { // replace strings
        index = strings.length; strings.push(all);
        return "'" + index + "'";
      } else if(regexCtx) { // replace RegExps
        index = strings.length; strings.push(regex);
        return prefix + "'" + index + "'";
      } else { // kill comments
        return comment !== "" ? " " : "\n";
      }
    });

    var atoms = splitToAtoms(codeWoStrings);
    var replaceContext;
    var declaredClasses = {}, currentClassId, classIdSeed = 0;

    function addAtom(text, type) {
      var lastIndex = atoms.length;
      atoms.push(text);
      return '"' + type + lastIndex + '"';
    }

    function generateClassId() {
      return "class" + (++classIdSeed);
    }

    function appendClass(class_, classId, scopeId) {
      class_.classId = classId;
      class_.scopeId = scopeId;
      declaredClasses[classId] = class_;
    }

    // function defined below
    var transformClassBody, transformStatementsBlock, transformStatements, transformMain, transformExpression;

    var classesRegex = /\b((?:(?:public|private|final|protected|static|abstract)\s+)*)(class|interface)\s+([A-Za-z_$][\w$]*\b)(\s+extends\s+[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*\b)?(\s+implements\s+[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*,\s*[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*\b)*)?\s*("A\d+")/g;
    var methodsRegex = /\b((?:(?:public|private|final|protected|static|abstract)\s+)*)((?!(?:else|new|return|throw|function|public|private|protected)\b)[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*"C\d+")*)\s*([A-Za-z_$][\w$]*\b)\s*("B\d+")(\s*throws\s+[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*,\s*[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*)*)?\s*("A\d+"|;)/g;
    var fieldTest = /^((?:(?:public|private|final|protected|static)\s+)*)((?!(?:else|new|return|throw)\b)[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*"C\d+")*)\s*([A-Za-z_$][\w$]*\b)\s*(?:"C\d+"\s*)*([=,]|$)/;
    var cstrsRegex = /\b((?:(?:public|private|final|protected|static|abstract)\s+)*)((?!(?:new|return|throw)\b)[A-Za-z_$][\w$]*\b)\s*("B\d+")(\s*throws\s+[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*,\s*[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*)*)?\s*("A\d+")/g;
    var attrAndTypeRegex = /^((?:(?:public|private|final|protected|static)\s+)*)((?!(?:new|return|throw)\b)[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*"C\d+")*)\s*/;
    var functionsRegex = /\bfunction(?:\s+([A-Za-z_$][\w$]*))?\s*("B\d+")\s*("A\d+")/g;

    function extractClassesAndMethods(code) {
      var s = code;
      s = s.replace(classesRegex, function(all) {
        return addAtom(all, 'E');
      });
      s = s.replace(methodsRegex, function(all) {
        return addAtom(all, 'D');
      });
      s = s.replace(functionsRegex, function(all) {
        return addAtom(all, 'H');
      });
      return s;
    }

    function extractConstructors(code, className) {
      var result = code.replace(cstrsRegex, function(all, attr, name, params, throws_, body) {
        if(name !== className) {
          return all;
        } else {
          return addAtom(all, 'G');
        }
      });
      return result;
    }

    function AstParam(name) {
      this.name = name;
    }
    AstParam.prototype.toString = function() {
      return this.name;
    };
    function AstParams(params) {
      this.params = params;
    }
    AstParams.prototype.getNames = function() {
      var names = [];
      for(var i=0,l=this.params.length;i<l;++i) {
        names.push(this.params[i].name);
      }
      return names;
    };
    AstParams.prototype.toString = function() {
      if(this.params.length === 0) {
        return "()";
      }
      var result = "(";
      for(var i=0,l=this.params.length;i<l;++i) {
        result += this.params[i] + ", ";
      }
      return result.substring(0, result.length - 2) + ")";
    };

    function transformParams(params) {
      var paramsWoPars = trim(params.substring(1, params.length - 1));
      var result = [];
      if(paramsWoPars !== "") {
        var paramList = paramsWoPars.split(",");
        for(var i=0; i < paramList.length; ++i) {
          var param = /\b([A-Za-z_$][\w$]*\b)\s*("[ABC][\d]*")?$/.exec(paramList[i]);
          result.push(new AstParam(param[1]));
        }
      }
      return new AstParams(result);
    }

    function preExpressionTransform(expr) {
      var s = expr;
      // new type[] {...} --> {...}
      s = s.replace(/\bnew\s+([A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*)(?:\s*"C\d+")+\s*("A\d+")/g, function(all, type, init) {
        return init;
      });
      // new Runnable() {...} --> "F???"
      s = s.replace(/\bnew\s+([A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*)(?:\s*"B\d+")\s*("A\d+")/g, function(all, type, init) {
        return addAtom(all, 'F');
      });
      // function(...) { } --> "H???"
      s = s.replace(functionsRegex, function(all) {
        return addAtom(all, 'H');
      });
      // new type[?] --> new ArrayList(?)
      s = s.replace(/\bnew\s+([A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*)\s*("C\d+"(?:\s*"C\d+")*)/g, function(all, type, index) {
        var args = index.replace(/"C(\d+)"/g, function(all, j) { return atoms[j]; }).
          replace(/\[\s*\]/g, "[0]").replace(/\s*\]\s*\[\s*/g, ", ");

        var arrayInitializer = "(" + args.substring(1, args.length - 1) + ")";
        return 'new ArrayList' + addAtom(arrayInitializer, 'B');
      });
      // .length() --> .length
      s = s.replace(/(\.\s*length)\s*"B\d+"/g, "$1");
      // #000000 --> 0x000000
      s = s.replace(/#([0-9A-Fa-f]{6})\b/g, function(all, digits) {
        return "0xFF" + digits;
      });
      // delete (type)???, (int)??? -> 0|???
      s = s.replace(/"B(\d+)"(\s*(?:[\w$']|"B))/g, function(all, index, next) {
        var atom = atoms[index];
        if(!/^\(\s*[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*\s*(?:"C\d+"\s*)*\)$/.test(atom)) {
          return all;
        } else if(/^\(\s*int\s*\)$/.test(atom)) {
          return "0|" + next;
        } else {
          var indexParts = atom.split(/"C(\d+)"/g);
          if(indexParts.length > 1) {
            // even items contains atom numbers, can check only first
            if(! /^\[\s*\]$/.test(atoms[indexParts[1]])) {
              return all; // fallback - not a cast
            }
          }
          return "" + next;
        }
      });
      // super() -> $superCstr(), super. -> $super.;
      s = s.replace(/\bsuper(\s*"B\d+")/g, "$$superCstr$1").replace(/\bsuper(\s*\.)/g, "$$super$1");
      // 3.0f -> 3.0
      s = s.replace(/\b(\.?\d+)[fF]/g, "$1");
      // Weird (?) parsing errors with %
      s = s.replace(/([^\s])%([^=\s])/g, "$1 % $2");
      // Since frameRate() and frameRate are different things,
      // we need to differentiate them somehow. So when we parse
      // the Processing.js source, replace frameRate so it isn't
      // confused with frameRate(), as well as keyPressed and mousePressed
      s = s.replace(/\b(frameRate|keyPressed|mousePressed)\b(?!\s*"B)/g, "__$1");
      // "pixels" replacements:
      //   pixels[i] = c => pixels.setPixel(i,c) | pixels[i] => pixels.getPixel(i)
      //   pixels.length => pixels.getLength()
      //   pixels = ar => pixels.set(ar) | pixels => pixels.toArray()
      s = s.replace(/\bpixels\s*(("C(\d+)")|\.length)?(\s*=(?!=)([^,\]\)\}\?\:]+))?/g,
        function(all, indexOrLength, index, atomIndex, equalsPart, rightSide) {
          if(index) {
            var atom = atoms[atomIndex];
            if(equalsPart) {
              return "pixels.setPixel" + addAtom("(" +atom.substring(1, atom.length - 1) +
                "," + rightSide + ")", 'B');
            } else {
              return "pixels.getPixel" + addAtom("(" + atom.substring(1, atom.length - 1) +
                ")", 'B');
            }
          } else if(indexOrLength) {
            // length
            return "pixels.getLength" + addAtom("()", 'B');
          } else {
            if(equalsPart) {
              return "pixels.set" + addAtom("(" + rightSide + ")", 'B');
            } else {
              return "pixels.toArray" + addAtom("()", 'B');
            }
          }
        });
      // this() -> $constr()
      s = s.replace(/\bthis(\s*"B\d+")/g, "$$constr$1");

      return s;
    }

    function AstInlineClass(baseInterfaceName, body) {
      this.baseInterfaceName = baseInterfaceName;
      this.body = body;
      body.owner = this;
    }
    AstInlineClass.prototype.toString = function() {
      return "new (function() {\n" + this.body + "})";
    };

    function transformInlineClass(class_) {
      var m = new RegExp(/\bnew\s*(Runnable)\s*"B\d+"\s*"A(\d+)"/).exec(class_);
      if(m === null) {
        return "null";
      } else {
        var oldClassId = currentClassId, newClassId = generateClassId();
        currentClassId = newClassId;
        // only Runnable supported
        var inlineClass = new AstInlineClass("Runnable", transformClassBody(atoms[m[2]], m[1]));
        appendClass(inlineClass, newClassId, oldClassId);

        currentClassId = oldClassId;
        return inlineClass;
      }
    }

    function AstFunction(name, params, body) {
      this.name = name;
      this.params = params;
      this.body = body;
    }
    AstFunction.prototype.toString = function() {
      var oldContext = replaceContext;
      // saving "this." and parameters
      var names = appendToLookupTable({"this":null}, this.params.getNames());
      replaceContext = function(name) {
        return names.hasOwnProperty(name) ? name : oldContext(name);
      };
      var result = "function";
      if(this.name) {
        result += " " + this.name;
      }
      result += this.params + " " + this.body;
      replaceContext = oldContext;
      return result;
    };

    function transformFunction(class_) {
      var m = new RegExp(/\b([A-Za-z_$][\w$]*)\s*"B(\d+)"\s*"A(\d+)"/).exec(class_);
      return new AstFunction( m[1] !== "function" ? m[1] : null,
        transformParams(atoms[m[2]]), transformStatementsBlock(atoms[m[3]]));
    }

    function AstInlineObject(members) {
      this.members = members;
    }
    AstInlineObject.prototype.toString = function() {
      var oldContext = replaceContext;
      replaceContext = function(name) {
          return name === "this"? name : oldContext(name); // saving "this."
      };
      var result = "";
      for(var i=0,l=this.members.length;i<l;++i) {
        if(this.members[i].label) {
          result += this.members[i].label + ": ";
        }
        result += this.members[i].value.toString() + ", ";
      }
      replaceContext = oldContext;
      return result.substring(0, result.length - 2);
    };

    function transformInlineObject(obj) {
      var members = obj.split(',');
      for(var i=0; i < members.length; ++i) {
        var label = members[i].indexOf(':');
        if(label < 0) {
          members[i] = { value: transformExpression(members[i]) };
        } else {
          members[i] = { label: trim(members[i].substring(0, label)),
            value: transformExpression( trim(members[i].substring(label + 1)) ) };
        }
      }
      return new AstInlineObject(members);
    }

    function expandExpression(expr) {
      if(expr.charAt(0) === '(' || expr.charAt(0) === '[') {
        return expr.charAt(0) + expandExpression(expr.substring(1, expr.length - 1)) + expr.charAt(expr.length - 1);
      } else if(expr.charAt(0) === '{') {
        if(/^\{\s*(?:[A-Za-z_$][\w$]*|'\d+')\s*:/.test(expr)) {
          return "{" + addAtom(expr.substring(1, expr.length - 1), 'I') + "}";
        } else {
          return "[" + expandExpression(expr.substring(1, expr.length - 1)) + "]";
        }
      } else {
        var trimmed = trimSpaces(expr);
        var result = preExpressionTransform(trimmed.middle);
        result = result.replace(/"[ABC](\d+)"/g, function(all, index) {
          return expandExpression(atoms[index]);
        });
        return trimmed.untrim(result);
      }
    }

    function replaceContextInVars(expr) {
      return expr.replace(/(\.\s*)?(\b[A-Za-z_$][\w$]*\b)/g,
        function(all, memberAccessSign, identifier) {
          if(memberAccessSign) {
            return all;
          } else {
            return replaceContext(identifier);
          }
        });
    }

    function AstExpression(expr, transforms) {
      this.expr = expr;
      this.transforms = transforms;
    }
    AstExpression.prototype.toString = function() {
      var transforms = this.transforms;
      var expr = replaceContextInVars(this.expr);
      return expr.replace(/"!(\d+)"/g, function(all, index) {
        return transforms[index].toString();
      });
    };

    transformExpression = function(expr) {
      var transforms = [];
      var s = expandExpression(expr);
      s = s.replace(/"H(\d+)"/g, function(all, index) {
        transforms.push(transformFunction(atoms[index]));
        return '"!' + (transforms.length - 1) + '"';
      });
      s = s.replace(/"F(\d+)"/g, function(all, index) {
        transforms.push(transformInlineClass(atoms[index]));
        return '"!' + (transforms.length - 1) + '"';
      });
      s = s.replace(/"I(\d+)"/g, function(all, index) {
        transforms.push(transformInlineObject(atoms[index]));
        return '"!' + (transforms.length - 1) + '"';
      });

      return new AstExpression(s, transforms);
    };

    function AstVarDefinition(name, value, isDefault) {
      this.name = name;
      this.value = value;
      this.isDefault = isDefault;
    }
    AstVarDefinition.prototype.toString = function() {
      return this.name + ' = ' + this.value;
    };

    function transformVarDefinition(def, defaultTypeValue) {
      var eqIndex = def.indexOf("=");
      var name, value, isDefault;
      if(eqIndex < 0) {
        name = def;
        value = defaultTypeValue;
        isDefault = true;
      } else {
        name = def.substring(0, eqIndex);
        value = transformExpression(def.substring(eqIndex + 1));
        isDefault = false;
      }
      return new AstVarDefinition( trim(name.replace(/(\s*"C\d+")+/g, "")),
        value, isDefault);
    }

    function getDefaultValueForType(type) {
        if(type === "int" || type === "float") {
          return "0";
        } else if(type === "boolean") {
          return "false";
        } else if(type === "color") {
          return "0x00000000";
        } else {
          return "null";
        }
    }

    function AstVar(definitions, varType) {
      this.definitions = definitions;
      this.varType = varType;
    }
    AstVar.prototype.getNames = function() {
      var names = [];
      for(var i=0,l=this.definitions.length;i<l;++i) {
        names.push(this.definitions[i].name);
      }
      return names;
    };
    AstVar.prototype.toString = function() {
      return "var " + this.definitions.join(",");
    };
    function AstStatement(expression) {
      this.expression = expression;
    }
    AstStatement.prototype.toString = function() {
      return this.expression.toString();
    };

    function transformStatement(statement) {
      if(fieldTest.test(statement)) {
        var attrAndType = attrAndTypeRegex.exec(statement);
        var definitions = statement.substring(attrAndType[0].length).split(",");
        var defaultTypeValue = getDefaultValueForType(attrAndType[2]);
        for(var i=0; i < definitions.length; ++i) {
          definitions[i] = transformVarDefinition(definitions[i], defaultTypeValue);
        }
        return new AstVar(definitions, attrAndType[2]);
      } else {
        return new AstStatement(transformExpression(statement));
      }
    }

    function AstForExpression(initStatement, condition, step) {
      this.initStatement = initStatement;
      this.condition = condition;
      this.step = step;
    }
    AstForExpression.prototype.toString = function() {
      return "(" + this.initStatement + "; " + this.condition + "; " + this.step + ")";
    };

    function AstForInExpression(initStatement, container) {
      this.initStatement = initStatement;
      this.container = container;
    }
    AstForInExpression.prototype.toString = function() {
      var init = this.initStatement.toString();
      if(init.indexOf("=") >= 0) { // can be without var declaration
        init = init.substring(0, init.indexOf("="));
      }
      return "(" + init + " in " + this.container + ")";
    };

    function transformForExpression(expr) {
      var content;
      if(/\bin\b/.test(expr)) {
        content = expr.substring(1, expr.length - 1).split(/\bin\b/g);
        return new AstForInExpression( transformStatement(trim(content[0])),
          transformExpression(content[1]));
      } else {
        content = expr.substring(1, expr.length - 1).split(";");
        return new AstForExpression( transformStatement(trim(content[0])),
          transformExpression(content[1]), transformExpression(content[2]));
      }
    }

    function AstInnerInterface(name) {
      this.name = name;
    }
    AstInnerInterface.prototype.toString = function() {
      return  "this." + this.name + " = function " + this.name + "() { "+
        "throw 'This is an interface'; };";
    };
    function AstInnerClass(name, body) {
      this.name = name;
      this.body = body;
      body.owner = this;
    }
    AstInnerClass.prototype.toString = function() {
      return "this." + this.name + " = function " + this.name + "() {\n" +
        this.body + "};";
    };

    function transformInnerClass(class_) {
      var m = classesRegex.exec(class_); // 1 - attr, 2 - class|int, 3 - name, 4 - extends, 5 - implements, 6 - body
      classesRegex.lastIndex = 0;
      var body = atoms[getAtomIndex(m[6])];
      if(m[2] === "interface") {
        return new AstInnerInterface(m[3]);
      } else {
        var oldClassId = currentClassId, newClassId = generateClassId();
        currentClassId = newClassId;
        var innerClass = new AstInnerClass(m[3], transformClassBody(body, m[3], m[4], m[5]));
        appendClass(innerClass, newClassId, oldClassId);
        currentClassId = oldClassId;
        return innerClass;
      }
    }

    function AstClassMethod(name, params, body) {
      this.name = name;
      this.params = params;
      this.body = body;
    }
    AstClassMethod.prototype.toString = function(){
      var thisReplacement = replaceContext("this");
      var paramNames = appendToLookupTable({}, this.params.getNames());
      var oldContext = replaceContext;
      replaceContext = function(name) {
        return paramNames.hasOwnProperty(name) ? name : oldContext(name);
      };
      var result = "processing.addMethod(" + thisReplacement + ", '" + this.name + "', function " + this.params + " " +
        this.body +");";
      replaceContext = oldContext;
      return result;
    };

    function transformClassMethod(method) {
      var m = methodsRegex.exec(method);
      methodsRegex.lastIndex = 0;
      return new AstClassMethod(m[3], transformParams(atoms[getAtomIndex(m[4])]),
        transformStatementsBlock(atoms[getAtomIndex(m[6])]) );
    }

    function AstClassField(definitions, fieldType, isStatic) {
      this.definitions = definitions;
      this.fieldType = fieldType;
      this.isStatic = isStatic;
    }
    AstClassField.prototype.getNames = function() {
      var names = [];
      for(var i=0,l=this.definitions.length;i<l;++i) {
        names.push(this.definitions[i].name);
      }
      return names;
    };
    AstClassField.prototype.toString = function() {
      var thisPrefix = replaceContext("this") + ".";
      if(this.isStatic) {
        var className = this.owner.name;
        var staticDeclarations = [];
        for(var i=0,l=this.definitions.length;i<l;++i) {
          var definition = this.definitions[i];
          var name = definition.name, staticName = className + "." + name;
          var declaration = "if(" + staticName + " === void(0)) {\n" +
            " " + staticName + " = " + definition.value + "; }\n" +
            "processing.defineProperty(" + replaceContext("this") + ", " +
            "'" + name + "', { get: function(){return " + staticName + ";}, " +
            "set: function(val){" + staticName + " = val;} });\n";
          staticDeclarations.push(declaration);
        }
        return staticDeclarations.join("");
      } else {
        return thisPrefix + this.definitions.join("; " + thisPrefix);
      }
    };

    function transformClassField(statement) {
      var attrAndType = attrAndTypeRegex.exec(statement);
      var isStatic = attrAndType[1].indexOf("static") >= 0;
      var definitions = statement.substring(attrAndType[0].length).split(/,\s*/g);
      var defaultTypeValue = getDefaultValueForType(attrAndType[2]);
      for(var i=0; i < definitions.length; ++i) {
        definitions[i] = transformVarDefinition(definitions[i], defaultTypeValue);
      }
      return new AstClassField(definitions, attrAndType[2], isStatic);
    }

    function AstConstructor(params, body) {
      this.params = params;
      this.body = body;
    }
    AstConstructor.prototype.toString = function() {
      var paramNames = appendToLookupTable({}, this.params.getNames());
      var oldContext = replaceContext;
      replaceContext = function(name) {
        return paramNames.hasOwnProperty(name) ? name : oldContext(name);
      };
      var prefix = "function $constr_" + this.params.params.length + this.params.toString();
      var body = this.body.toString();
      if(!/\$(superCstr|constr)\b/.test(body)) {
        body = "{\n$superCstr();\n" + body.substring(1);
      }
      replaceContext = oldContext;
      return prefix + body + "\n";
    };

    function transformConstructor(cstr) {
      var m = new RegExp(/"B(\d+)"\s*"A(\d+)"/).exec(cstr);
      var params = transformParams(atoms[m[1]]);

      return new AstConstructor(params, transformStatementsBlock(atoms[m[2]]));
    }

    function AstClassBody(name, baseClassName, functions, methods, fields, cstrs, innerClasses, misc) {
      var i,l;
      this.name = name;
      this.baseClassName = baseClassName;
      this.functions = functions;
      this.methods = methods;
      this.fields = fields;
      this.cstrs = cstrs;
      this.innerClasses = innerClasses;
      this.misc = misc;
      for(i=0,l=fields.length; i<l; ++i) {
        fields[i].owner = this;
      }
    }
    AstClassBody.prototype.getMembers = function() {
      var members;
      if(this.owner.base) {
        members = this.owner.base.body.getMembers();
      } else {
        members = { fields: [], methods: [], innerClasses: [] };
      }
      var i, j, l, m;
      for(i=0,l=this.fields.length;i<l;++i) {
        members.fields = members.fields.concat(this.fields[i].getNames());
      }
      for(i=0,l=this.methods.length;i<l;++i) {
        var method = this.methods[i];
        members.methods.push(method.name);
      }
      for(i=0,l=this.innerClasses.length;i<l;++i) {
        var innerClass = this.innerClasses[i];
        members.innerClasses.push(innerClass.name);
      }
      return members;
    };
    AstClassBody.prototype.toString = function() {
      function getScopeLevel(p) {
        var i = 0;
        while(p) {
          ++i;
          p=p.scope;
        }
        return i;
      }

      var scopeLevel = getScopeLevel(this.owner);

      var selfId = "$this_" + scopeLevel;
      var result = "var " + selfId + " = this;\n";

      var members = this.getMembers();
      var thisClassFields = appendToLookupTable({}, members.fields),
        thisClassMethods = appendToLookupTable({}, members.methods),
        thisClassInners = appendToLookupTable({}, members.innerClasses);

      var oldContext = replaceContext;
      replaceContext = function(name) {
        if(name === "this") {
          return selfId;
        } else if(thisClassFields.hasOwnProperty(name) || thisClassInners.hasOwnProperty(name)) {
          return selfId + "." + name;
        } else if(thisClassMethods.hasOwnProperty(name)) {
          return "this." + name;
        }
        return oldContext(name);
      };

      if(this.baseClassName) {
        result += "var $super = {};\n";
        result += "function $superCstr(){\n" +
                        this.baseClassName + ".prototype.constructor.apply($super, arguments);\n" +
                        "processing.extendClass(" + selfId + ", $super); }\n";
      } else {
        result += "function $superCstr() { }\n";
      }

      result += this.functions.join('\n') + '\n';
      result += this.innerClasses.join('\n');

      result += this.fields.join(";\n") + ";\n";
      result += this.methods.join('\n') + '\n';
      result += this.misc.tail;

      result += this.cstrs.join('\n') + '\n';

      result += "function $constr() {\n";
      var cstrsIfs = [];
      for(var i=0,l=this.cstrs.length;i<l;++i) {
        var paramsLength = this.cstrs[i].params.params.length;
        cstrsIfs.push("if(arguments.length === " + paramsLength + ") { " +
          "$constr_" + paramsLength + ".apply(" + selfId + ", arguments); }");
      }
      if(cstrsIfs.length > 0) {
        result += cstrsIfs.join(" else ") + " else ";
      }
      // ??? add check if length is 0, otherwise fail
      result += "$superCstr(); }\n";
      result += "$constr.apply(null, arguments);\n";

      replaceContext = oldContext;
      return result;
    };

    transformClassBody = function(body, name, baseName, impls) {
      var declarations = body.substring(1, body.length - 1);
      declarations = extractClassesAndMethods(declarations);
      declarations = extractConstructors(declarations, name);
      var methods = [], classes = [], cstrs = [], functions = [];
      declarations = declarations.replace(/"([DEGH])(\d+)"/g, function(all, type, index) {
        if(type === 'D') { methods.push(index); }
        else if(type === 'E') { classes.push(index); }
        else if(type === 'H') { functions.push(index); }
        else { cstrs.push(index); }
        return "";
      });
      var fields = declarations.split(';');
      var baseClassName;
      var i;

      if(baseName !== undef) {
        baseClassName = baseName.replace(/^\s*extends\s+([A-Za-z_$][\w$]*)\s*$/g, "$1");
      }

      for(i = 0; i < functions.length; ++i) {
        functions[i] = transformFunction(atoms[functions[i]]);
      }
      for(i = 0; i < methods.length; ++i) {
        methods[i] = transformClassMethod(atoms[methods[i]]);
      }
      for(i = 0; i < fields.length - 1; ++i) {
        var field = trimSpaces(fields[i]);
        fields[i] = transformClassField(field.middle);
      }
      var tail = fields.pop();
      for(i = 0; i < cstrs.length; ++i) {
        cstrs[i] = transformConstructor(atoms[cstrs[i]]);
      }
      for(i = 0; i < classes.length; ++i) {
        classes[i] = transformInnerClass(atoms[classes[i]]);
      }

      return new AstClassBody(name, baseClassName, functions, methods, fields, cstrs,
        classes, { tail: tail });
    };

    function AstInterface(name) {
      this.name = name;
    }
    AstInterface.prototype.toString = function() {
      return "function " + this.name + "() {  throw 'This is an interface'; }\n" +
        "processing." + this.name + " = " + this.name + ";";
    };
    function AstClass(name, body) {
      this.name = name;
      this.body = body;
      body.owner = this;
    }
    AstClass.prototype.toString = function() {
      var staticVars = "";
      for (var i = 0, l = this.body.fields.length; i < l; i++) {
        if (this.body.fields[i].isStatic) {
          for (var x = 0, xl = this.body.fields[i].definitions.length; x < xl; x++) {
            staticVars += "var " + this.body.fields[i].definitions[x].name + " = " + this.body.name + "." + this.body.fields[i].definitions[x] + ";";
          }
        }
      }
      return "function " + this.name + "() {\n" + this.body + "}\n" +
        staticVars + "\n" +
        "processing." + this.name + " = " + this.name + ";";
    };


    function transformGlobalClass(class_) {
      var m = classesRegex.exec(class_); // 1 - attr, 2 - class|int, 3 - name, 4 - extends, 5 - implements, 6 - body
      classesRegex.lastIndex = 0;
      var body = atoms[getAtomIndex(m[6])];
      if(m[2] === "interface") {
        return new AstInterface(m[3]);
      } else {
        var oldClassId = currentClassId, newClassId = generateClassId();
        currentClassId = newClassId;
        var globalClass = new AstClass(m[3], transformClassBody(body, m[3], m[4], m[5]) );
        appendClass(globalClass, newClassId, oldClassId);

        currentClassId = oldClassId;
        return globalClass;
      }
    }

    function AstMethod(name, params, body) {
      this.name = name;
      this.params = params;
      this.body = body;
    }
    AstMethod.prototype.toString = function(){
      var paramNames = appendToLookupTable({}, this.params.getNames());
      var oldContext = replaceContext;
      replaceContext = function(name) {
        return paramNames.hasOwnProperty(name) ? name : oldContext(name);
      };
      var result = "function " + this.name + this.params + " " + this.body + "\n" +
        "processing." + this.name + " = " + this.name + ";";
      replaceContext = oldContext;
      return result;
    };

    function transformGlobalMethod(method) {
      var m = methodsRegex.exec(method);
      var result =
      methodsRegex.lastIndex = 0;
      return new AstMethod(m[3], transformParams(atoms[getAtomIndex(m[4])]),
        transformStatementsBlock(atoms[getAtomIndex(m[6])]));
    }

    function preStatementsTransform(statements) {
      var s = statements;
      s = s.replace(/\b(catch\s*"B\d+"\s*"A\d+")(\s*catch\s*"B\d+"\s*"A\d+")+/g, "$1");
      return s;
    }

    function AstForStatement(argument, misc) {
      this.argument = argument;
      this.misc = misc;
    }
    AstForStatement.prototype.toString = function() {
      return this.misc.prefix + this.argument.toString();
    };
    function AstCatchStatement(argument, misc) {
      this.argument = argument;
      this.misc = misc;
    }
    AstCatchStatement.prototype.toString = function() {
      return this.misc.prefix + this.argument.toString();
    };
    function AstPrefixStatement(name, argument, misc) {
      this.name = name;
      this.argument = argument;
      this.misc = misc;
    }
    AstPrefixStatement.prototype.toString = function() {
      var result = this.misc.prefix;
      if(this.argument !== undef) {
        result += this.argument.toString();
      }
      return result;
    };
    function AstLabel(label) {
      this.label = label;
    }
    AstLabel.prototype.toString = function() {
      return this.label;
    };

    transformStatements = function(statements, transformMethod, transformClass) {
      var nextStatement = new RegExp(/\b(catch|for|if|switch|while|with)\s*"B(\d+)"|\b(do|else|finally|return|throw|try|break|continue)\b|("[ADEH](\d+)")|\b((?:case\s[^:]+|[A-Za-z_$][\w$]*\s*):)|(;)/g);
      var res = [];
      statements = preStatementsTransform(statements);
      var lastIndex = 0, m, space;
      while((m = nextStatement.exec(statements)) !== null) {
        if(m[1] !== undef) { // catch, for ...
          var i = statements.lastIndexOf('"B', nextStatement.lastIndex);
          var statementsPrefix = statements.substring(lastIndex, i);
          if(m[1] === "for") {
            res.push(new AstForStatement(transformForExpression(atoms[m[2]]),
              { prefix: statementsPrefix }) );
          } else if(m[1] === "catch") {
            res.push(new AstCatchStatement(transformParams(atoms[m[2]]),
              { prefix: statementsPrefix }) );
          } else {
            res.push(new AstPrefixStatement(m[1], transformExpression(atoms[m[2]]),
              { prefix: statementsPrefix }) );
          }
        } else if(m[3] !== undef) { // do, else, ...
            res.push(new AstPrefixStatement(m[3], undef,
              { prefix: statements.substring(lastIndex, nextStatement.lastIndex) }) );
        } else if(m[4] !== undef) { // block, class and methods
          space = statements.substring(lastIndex, nextStatement.lastIndex - m[4].length);
          if(trim(space).length !== 0) { continue; } // avoiding new type[] {} construct
          res.push(space);
          var kind = m[4].charAt(1), atomIndex = m[5];
          if(kind === 'D') {
            res.push(transformMethod(atoms[atomIndex]));
          } else if(kind === 'E') {
            res.push(transformClass(atoms[atomIndex]));
          } else if(kind === 'H') {
            res.push(transformFunction(atoms[atomIndex]));
          } else {
            res.push(transformStatementsBlock(atoms[atomIndex]));
          }
        } else if(m[6] !== undef) { // label
          space = statements.substring(lastIndex, nextStatement.lastIndex - m[6].length);
          if(trim(space).length !== 0) { continue; } // avoiding ?: construct
          res.push(new AstLabel(statements.substring(lastIndex, nextStatement.lastIndex)) );
        } else { // semicolon
          var statement = trimSpaces(statements.substring(lastIndex, nextStatement.lastIndex - 1));
          res.push(statement.left);
          res.push(transformStatement(statement.middle));
          res.push(statement.right + ";");
        }
        lastIndex = nextStatement.lastIndex;
      }
      var statementsTail = trimSpaces(statements.substring(lastIndex));
      res.push(statementsTail.left);
      if(statementsTail.middle !== "") {
        res.push(transformStatement(statementsTail.middle));
        res.push(";" + statementsTail.right);
      }
      return res;
    };

    function getLocalNames(statements) {
      var localNames = [];
      for(var i=0,l=statements.length;i<l;++i) {
        var statement = statements[i];
        if(statement instanceof AstVar) {
          localNames = localNames.concat(statement.getNames());
        } else if(statement instanceof AstForStatement &&
          statement.argument.initStatement instanceof AstVar) {
          localNames = localNames.concat(statement.argument.initStatement.getNames());
        } else if(statement instanceof AstInnerInterface || statement instanceof AstInnerClass ||
          statement instanceof AstInterface || statement instanceof AstClass ||
          statement instanceof AstMethod || statement instanceof AstFunction) {
          localNames.push(statement.name);
        }
      }
      return appendToLookupTable({}, localNames);
    }

    function AstStatementsBlock(statements) {
      this.statements = statements;
    }
    AstStatementsBlock.prototype.toString = function() {
      var localNames = getLocalNames(this.statements);
      var oldContext = replaceContext;

      // replacing context only when necessary
      if(!isLookupTableEmpty(localNames)) {
        replaceContext = function(name) {
          return localNames.hasOwnProperty(name) ? name : oldContext(name);
        };
      }

      var result = "{\n" + this.statements.join('') + "\n}";
      replaceContext = oldContext;
      return result;
    };

    transformStatementsBlock = function(block) {
      var content = trimSpaces(block.substring(1, block.length - 1));
      return new AstStatementsBlock(transformStatements(content.middle));
    };

    function AstRoot(statements) {
      this.statements = statements;
    }
    AstRoot.prototype.toString = function() {
      var localNames = getLocalNames(this.statements);
      replaceContext = function(name) {
        if(localNames.hasOwnProperty(name)) {
          return name;
        } else if(globalMembers.hasOwnProperty(name)) {
          return "processing." + name;
        } else if(PConstants.hasOwnProperty(name)) {
          return "$constants." + name;
        }
        return name;
      };
      var result = "// this code was autogenerated from PJS\n" +
        "(function(processing, $constants) {\n" +
        this.statements.join('') + "\n})";
      replaceContext = null;
      return result;
    };

    transformMain = function() {
      var statements = extractClassesAndMethods(atoms[0]);
      statements = statements.replace(/\bimport\s+[^;]+;/g, "");
      return new AstRoot( transformStatements(statements,
        transformGlobalMethod, transformGlobalClass) );
    };

    function generateMetadata(ast) {
      var globalScope = {};
      var id, class_;
      for(id in declaredClasses) {
        if(declaredClasses.hasOwnProperty(id)) {
          class_ = declaredClasses[id];
          var scopeId = class_.scopeId, name = class_.name;
          if(scopeId) {
            var scope = declaredClasses[scopeId];
            class_.scope = scope;
            if(scope.inScope === undef) {
              scope.inScope = {};
            }
            scope.inScope[name] = class_;
          } else {
            globalScope[name] = class_;
          }
        }
      }

      function findInScopes(class_, name) {
        var parts = name.split('.');
        var currentScope = class_.scope, found;
        while(currentScope) {
          if(currentScope.hasOwnProperty(parts[0])) {
            found = currentScope[parts[0]]; break;
          }
          currentScope = currentScope.scope;
        }
        if(found === undef) {
          found = globalScope[parts[0]];
        }
        for(var i=1,l=parts.length;i<l && found;++i) {
          found = found.inScope[parts[i]];
        }
        return found;
      }

      for(id in declaredClasses) {
        if(declaredClasses.hasOwnProperty(id)) {
          class_ = declaredClasses[id];
          var baseClassName = class_.body.baseClassName;
          if(baseClassName) {
            class_.base = findInScopes(class_, baseClassName);
          }
        }
      }
    }

    var transformed = transformMain();
    generateMetadata(transformed);

    // remove empty extra lines with space
    var redendered = transformed.toString();
    redendered = redendered.replace(/\s*\n(?:[\t ]*\n)+/g, "\n\n");

    return injectStrings(redendered, strings);
  }// Parser ends

  function preprocessCode(aCode, sketch) {
    // Parse out @pjs directive, if any.
    var dm = new RegExp(/\/\*\s*@pjs\s+((?:[^\*]|\*+[^\*\/])*)\*\//g).exec(aCode);
    if (dm && dm.length === 2) {
      // masks contents of a JSON to be replaced later
      // to protect the contents from further parsing
      var jsonItems = [],
          directives = dm.splice(1, 2)[0].replace(/\{([\s\S]*?)\}/g, (function() {
            return function(all, item) {
              jsonItems.push(item);
              return "{" + (jsonItems.length-1) + "}";
            };
          }())).replace('\n', '').replace('\r', '').split(";");

      // We'll L/RTrim, and also remove any surrounding double quotes (e.g., just take string contents)
      var clean = function(s) {
        return s.replace(/^\s*["']?/, '').replace(/["']?\s*$/, '');
      };

      for (var i = 0, dl = directives.length; i < dl; i++) {
        var pair = directives[i].split('=');
        if (pair && pair.length === 2) {
          var key = clean(pair[0]),
              value = clean(pair[1]),
              list = [];
          // A few directives require work beyond storying key/value pairings
          if (key === "preload") {
            list = value.split(',');
            // All pre-loaded images will get put in imageCache, keyed on filename
            for (var j = 0, jl = list.length; j < jl; j++) {
              var imageName = clean(list[j]);
              sketch.imageCache.add(imageName);
            }
          } else if (key === "transparent") {
            sketch.options.isTransparent = value === "true";
          // fonts can be declared as a string containing a url,
          // or a JSON object, containing a font name, and a url
          } else if (key === "font") {
            list = value.split(",");
            for (var x = 0, xl = list.length; x < xl; x++) {
              var fontName = clean(list[x]),
                  index = /^\{(\d*?)\}$/.exec(fontName);
              // if index is not null, send JSON, otherwise, send string
              sketch.fonts.add(index ? JSON.parse("{" + jsonItems[index[1]] + "}") : fontName);
            }
          } else if (key === "crisp") {
            sketch.options.crispLines = value === "true";
          } else if (key === "pauseOnBlur") {
            sketch.options.pauseOnBlur = value === "true";
          } else {
            sketch.options[key] = value;
          }
        }
      }
    }

    // Check if 3D context is invoked -- this is not the best way to do this.
    var codeWoStrings = aCode.replace(/("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(([\[\(=|&!\^:?]\s*)(\/(?![*\/])(?:[^\/\\\n]|\\.)*\/[gim]*)\b)|(\/\/[^\n]*\n)|(\/\*(?:(?!\*\/)(?:.|\n))*\*\/)/g, "");
    if (codeWoStrings.match(/\bsize\((?:.+),(?:.+),\s*(OPENGL|P3D)\s*\);/)) {
      sketch.use3DContext = true;
    }
    return aCode;
  }

  // Parse/compiles Processing (Java-like) syntax to JavaScript syntax
  Processing.compile = function(pdeCode) {
    var sketch = new Processing.Sketch();
    var code = preprocessCode(pdeCode, sketch);
    var compiledPde = parseProcessing(code);
    sketch.sourceCode = compiledPde;
    return sketch;
  };

  Error.prototype.printStackTrace = function() {
     return this.toString();
  };

  Processing.version = "0.9.7";

  // Share lib space
  Processing.lib = {};

  // Store Processing instances
  Processing.instances = [];
  Processing.instanceIds = {};

  Processing.removeInstance = function(id) {
    Processing.instances.splice(Processing.instanceIds[id], 1);
    delete Processing.instanceIds[id];
  };

  Processing.addInstance = function(processing) {
    if (processing.externals.canvas.id === undef || !processing.externals.canvas.id.length) {
      processing.externals.canvas.id = "__processing" + Processing.instances.length;
    }
    Processing.instanceIds[processing.externals.canvas.id] = Processing.instances.length;
    Processing.instances.push(processing);
  };

  Processing.getInstanceById = function(name) {
    return Processing.instances[Processing.instanceIds[name]];
  };

  Processing.Sketch = function(attachFunction) {
    this.attachFunction = attachFunction; // can be optional
    this.use3DContext = false;
    this.options = {
      isTransparent: false,
      crispLines: false,
      pauseOnBlur: false
    };
    this.imageCache = {
      pending: 0,
      images: {},
      add: function(href) {
        var img = new Image();
        img.onload = (function(owner) {
          return function() {
            owner.pending--;
          };
        }(this));
        this.pending++;
        this.images[href] = img;
        img.src = href;
      }
    };
    this.fonts = {
      // template element used to compare font sizes
      template: (function() {
        var element = document.createElement('p');
        element.style.fontFamily = "serif";
        element.style.fontSize = "72px";
        element.style.visibility = "hidden";
        element.innerHTML = "abcmmmmmmmmmmlll";
        document.getElementsByTagName("body")[0].appendChild(element);
        return element;
      }()),
      // number of attempts to load a font
      attempt: 0,
      // returns true is fonts are all loaded,
      // true if number of attempts hits the limit,
      // false otherwise
      pending: function() {
        var r = true;
        for (var i = 0; i < this.fontList.length; i++) {
          // compares size of text in pixels, if equal, custom font is not yet loaded
          if (this.fontList[i].offsetWidth === this.template.offsetWidth && this.fontList[i].offsetHeight === this.template.offsetHeight) {
            r = false;
            this.attempt++;
          } else {
            // removes loaded font from the array and dom, so we don't compare it again
            document.getElementsByTagName("body")[0].removeChild(this.fontList[i]);
            this.fontList.splice(i--, 1);
            this.attempt = 0;
          }
        }
        // give up loading after max attempts have been reached
        if (this.attempt >= 30) {
          r = true;
          // remove remaining elements from the dom and array
          for (var j = 0; j < this.fontList.length; j++) {
            document.getElementsByTagName("body")[0].removeChild(this.fontList[j]);
            this.fontList.splice(j--, 1);
          }
        }
        // Remove the template element from the dom once done comparing
        if (r) {
          document.getElementsByTagName("body")[0].removeChild(this.template);
        }
        return r;
      },
      // fontList contains elements to compare font sizes against a template
      fontList: [],
      // string containing a css @font-face list of custom fonts
      fontFamily: "",
      // style element to hold the @font-face string
      style: document.createElement('style'),
      // adds a font to the font cache
      // creates an element using the font, to start loading the font,
      // and compare against a default font to see if the custom font is loaded
      add: function(fontSrc) {
        // fontSrc can be a string or a JSON object
        // string contains a url to a font
        // JSON object would contain a name and a url
        // acceptable fonts are .ttf, .otf, and a data uri
        var fontName = (typeof fontSrc === 'object' ? fontSrc.fontFace : fontSrc),
            fontUrl = (typeof fontSrc === 'object' ? fontSrc.url : fontSrc);
        // creating the @font-face style
        this.fontFamily += "@font-face{\n  font-family: '" + fontName + "';\n  src:  url('" + fontUrl + "');\n}\n";
        this.style.innerHTML = this.fontFamily;
        document.getElementsByTagName("head")[0].appendChild(this.style);
        // creating the element to load, and compare the new font
        var preLoader = document.createElement('p');
        preLoader.style.fontFamily = "'" + fontName + "', serif";
        preLoader.style.fontSize = "72px";
        preLoader.style.visibility = "hidden";
        preLoader.innerHTML = "abcmmmmmmmmmmlll";
        document.getElementsByTagName("body")[0].appendChild(preLoader);
        this.fontList.push(preLoader);
      }
    };
    this.sourceCode = undefined;
    this.attach = function(processing, constants) {
      // either attachFunction or sourceCode must be present on attach
      if(typeof this.attachFunction === "function") {
        this.attachFunction(processing, constants);
      } else if(this.sourceCode) {
        var func = eval(this.sourceCode);
        func(processing, constants);
        this.attachFunction = func;
      } else {
        throw "Unable to attach sketch to the processing instance";
      }
    };
    this.toString = function() {
      return this.sourceCode || "[attach: " + this.attachFunction + "]";
    };
    this.onblur = function() {};
    this.onfocus = function() {};
  };

  // Automatic Initialization Method
  var init = function() {
    var canvas = document.getElementsByTagName('canvas');

    for (var i = 0, l = canvas.length; i < l; i++) {
      // datasrc and data-src are deprecated.
      var processingSources = canvas[i].getAttribute('data-processing-sources');
      if (processingSources === null) {
        // Temporary fallback for datasrc and data-src
        processingSources = canvas[i].getAttribute('data-src');
        if (processingSources === null) {
          processingSources = canvas[i].getAttribute('datasrc');
        }
      }
      if (processingSources) {
        // The problem: if the HTML canvas dimensions differ from the
        // dimensions specified in the size() call in the sketch, for
        // 3D sketches, browsers will either not render or render the
        // scene incorrectly. To fix this, we need to adjust the attributes
        // of the canvas width and height.
        // Get the source, we'll need to find what the user has used in size()
        var filenames = processingSources.split(' ');
        var code = "";
        for (var j = 0, fl = filenames.length; j < fl; j++) {
          if (filenames[j]) {
            var block = ajax(filenames[j]);
            if (block !== false) {
              code += ";\n" + block;
            }
          }
        }
        Processing.addInstance(new Processing(canvas[i], code));
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    init();
  }, false);

  // pauseOnBlur handling
  window.addEventListener('blur', function() {
    for (var i = 0; i < Processing.instances.length; i++) {
      Processing.instances[i].externals.onblur();
    }
  }, false);

  window.addEventListener('focus', function() {
    for (var i = 0; i < Processing.instances.length; i++) {
      Processing.instances[i].externals.onfocus();
    }
  }, false);

}());


