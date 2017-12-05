function sortStrings(strings){
    return strings.sort();
}

function capAsync(anArray, callback) {
    window.setTimeout(
        function() {
            return callback(anArray);
        },
        2000
    );

}



// write a function that asynchronously sorts an array of strings in
// alphabetical order
var strings = [
    'zebra', 'donkey', 'nun', 'banana', 'steve irwin',
    'spiderman', 'wonder woman', 'batman'
];

var result = capAsync(strings, sortStrings);
document.write(result);








function success(someString) {
    console.log(someString);
}

function onError(error) {
    console.log('error function fired', error);
}

function onErrorCatch(error) {
    console.log('error catch function fired', error);
}

function doSomethingAsync(callback, args) {
    var promise = new Promise(executor);

    return promise;

    function executor(callback, args, resolve, reject) {
        window.setTimeout(
            function() {
                var somethingGoodHappened = callback(args);

                if( !somethingGoodHappened ) {
                    reject('something bad happened')
                }
                else {
                    resolve('we are all happy');
                }
            },
            Math.random() * 2000 + 1000
        );
    }

}
