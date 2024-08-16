var tape = require("tape");

var protobuf = require("..");

var def = {};

var proto = "package ns;\
message Outer {\
    message Inner {}\
}\
service Svc {}";

tape.test("nested children of namespaces", function(test) {

    var ns = protobuf.Namespace.fromJSON("ns", def);

    var root = protobuf.parse(proto).root;
    ns = root.lookup("ns").resolveAll();

    var outer = ns.lookup('.Outer')
    test.ok(outer, "outer should be defined")
    test.equal(outer.fullName, '.ns.Outer')
    test.equal(outer.nestedArray.length, 1)
    
    var inner = ns.lookup('.Outer.Inner')
    test.ok(inner, "inner should be defined")
    test.equal(inner.fullName, '.ns.Outer.Inner')
    test.same(outer, inner.parent)
    
    /**
     * If this line is removed, then the test passes
     */
    inner.name = 'Renamed'

    outer = outer.remove(inner)
    test.equal(outer.nestedArray.length, 0)


    test.end();
});
