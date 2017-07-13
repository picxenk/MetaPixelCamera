var test = function() {
    console.log('hi 안녕');

    this.do = function() {
        console.log('오에~~');
    }
}

test();

var t = new test();
var 테스트 = t;

// 테스트();

// 테스트();
// test.do();

테스트.do();
