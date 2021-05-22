# Facts
* promise is just another way of doing async programming
* promise is a token that represents a future value ,and state 
* future value inside that promise is determined by the function that returns the promise,i.e, Calling Func
* promise-> initial state-> pending
* promise -> 
        final state-> 
            resolved -> you have got the future value
            rejected-> error
* to consume  a promise we have two **Synchronous function**
then and catch. They are used to register/attach cb function on that promise
* cb functions passed inside then and catch act as async
*  promise can be rejected or resolved only once in its lifetime 
*  then -> can accept upto 2 optional callbacks->  then(scb,fcb)
                    first -> success callback
                    second -> failure callback
* catch is nothing but  then(undefined,fcb); 
* every then and catch also returns a promise (Important-> Promise Chainning is an implementation of this feature)
* final state of promise returned from then/catch depends upon value returned from their cb =>scb,fcb i.e,
 if cb returns * then your promise will resolve into ** ,i.e.,
    *val=> **val 
    *nothing=> **undefined 
    *promise=> **resolved-value of promise 
