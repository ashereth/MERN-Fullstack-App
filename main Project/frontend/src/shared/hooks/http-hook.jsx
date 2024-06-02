import { useState, useCallback, useRef, useEffect, act } from "react";

export const useHttpClient = () => {
    //keep track of loading state and errors
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    //keep track of http requests so that errors dont occur if the page changes before http request finishes
    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback(async (
        url,
        method = 'GET',
        body = null,
        headers = {}) => {
        setIsLoading(true)
        //keep
        const httpAbortController = new AbortController();
        activeHttpRequest.current.push(httpAbortController);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortController.signal
            });

            const responseData = await response.json();
            //remove the http request from current once it finishes
            activeHttpRequest.current = activeHttpRequest.current.filter(
                reqCtrl => reqCtrl !== httpAbortController
            );

            if (!response.ok) {
                throw new Error(responseData.message);
            }
            setIsLoading(false)
            return responseData;
        } catch (err) {
            setIsLoading(false)
            setError(err.message || 'unkown error')
            throw err;
        }
        
    }, []);

    const clearError = () => {
        setError(null);
    }

    //cleanup function for when this custom hook unmounts
    useEffect(() => {
        return () => {
            //call abort on all http requests
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])

    return { isLoading, error, sendRequest, clearError };
};