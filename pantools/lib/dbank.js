(function(exports){


    var decode = require("js-base64").Base64.decode;
    var md5 = require("md5").digest_s;

    var c = function(h, l) {
        var k = [],
            e = 0,
            d, g = "";
        for (var f = 0; f < 256; f++) {
            k[f] = f
        }
        for (f = 0; f < 256; f++) {
            e = (e + k[f] + h.charCodeAt(f % h.length)) % 256;
            d = k[f];
            k[f] = k[e];
            k[e] = d
        }
        f = 0;
        e = 0;
        for (var m = 0; m < l.length; m++) {
            f = (f + 1) % 256;
            e = (e + k[f]) % 256;
            d = k[f];
            k[f] = k[e];
            k[e] = d;
            g += String.fromCharCode(l.charCodeAt(m) ^ k[(k[f] + k[e]) % 256])
        }
        return g
    };    

    var xor = function(s1, s2) {
        var h = 0, ret = "";
        var l1 = s1.length;
        var l2 = s2.length;

        for(; h < l1; h++) {
            var j = s1.charCodeAt(h) ^ s2.charCodeAt(h % l2);
            ret = ret + String.fromCharCode(j)
        }

        return ret
    }

    var decrypt = function(str, salt) {
        var s = decode(str);
        var ret;
        var salt_type = salt.substr(0, 2);

        switch (salt_type) {
            case "ea":
                ret = s;
                break;
            case "eb":
                ret = xor(s, c(salt, salt));
                break;
            case "ed":
                ret = xor(s, md5(salt));
                break;
            default:
                ret = s;
        }

        return ret
    }

    var thunder_decode = function(url) {
        var s = decode(url.substr(10))
        return s.substr(2, s.length-4)
    }

    exports.decrypt = decrypt;
    exports.thunder_decode = thunder_decode;

})(exports);
