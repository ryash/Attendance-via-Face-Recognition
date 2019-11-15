/**
 * Different possible operating modes of the application
 */
export const modes = {
    USER: 0,
    ADMIN: 1,
    ANONYMOUS: 2,
};

/**
 * Function to make any promise cancelable.
 */
export const makeCancelablePromise = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then(
        val => {
          if (hasCanceled_){
            let error = new Error('Promise is canceled');
            error.isCanceled = true;
            reject(error);
          } else {
            resolve(val);
          }
        },
        error => {
          error.isCanceled = false;
          if (hasCanceled_){
            error.isCanceled = true;
            reject(error);
          }
          else {
            error.isCanceled = false;
            reject(error);
          }
      });
    });

    return {
      promise: wrappedPromise,
      cancel() {
        hasCanceled_ = true;
      },
    };
};
