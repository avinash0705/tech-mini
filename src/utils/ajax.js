// Simple AJAX wrapper for API calls
const ajaxWrapper = async (
    {
        method = 'GET',
        returnCompRes = false,
        body,
        noCache = true,
        bearerToken = false,
        url = '',
        credentials = 'include',
        headers,
        success,
        refreshSuccess,
        error,
        isRefreshCentralLoginDone = false,
        do401Handling = false,
        redirectToLoginIfLoggedOut = false,
        systemid = 135,
        isFileUpload = false,
        handleReCaptcha = false,
        captchaResponse = '',
        noCacheWithoutPragma = false,
        do406Handling = false,
        showCaptchaCallback,
    },
    pLogger
) => {
    try {
        const noCacheHeaders = {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0'
        };
        const noCacheWithoutPragmaHeaders = {
            'Cache-Control': 'no-cache'
        };
        
        if (method === 'DELETE' || method === 'PUT') {
            headers = { ...headers, 'x-http-method-override': method };
            method = 'POST';
        }
        
        if (
            process.env.NEXT_PUBLIC_APP_ENV === 'docker' ||
            process.env.NEXT_PUBLIC_APP_ENV === 'development'
        ) {
            noCache = false;
        }

        const response = await fetch(url, {
            method,
            credentials,
            headers: {
                clientid: 'm0b5',
                appid: '135',
                systemid,
                ...(!isFileUpload && { 'Content-Type': 'application/json' }),
                accept: 'application/json',
                ...(noCache && noCacheHeaders),
                ...(noCacheWithoutPragma && noCacheWithoutPragmaHeaders),
                ...(captchaResponse && { 'g-recaptcha-response': captchaResponse }),
                ...headers
            },
            ...(body && (!isFileUpload ? { body: JSON.stringify(body) } : { body }))
        });

        if (response.status >= 200 && response.status <= 299) {
            if (returnCompRes) {
                return response;
            }
            const data = await response.json();
            if (success) {
                success(data);
            }
            return data;
        } else {
            const errorData = await response.json().catch(() => ({}));
            if (error) {
                error(errorData);
            }
            return { error: errorData };
        }
    } catch (err) {
        if (pLogger) {
            pLogger.log('AJAX ERROR', err);
        }
        if (error) {
            error(err);
        }
        return { error: err };
    }
};

export default ajaxWrapper;
