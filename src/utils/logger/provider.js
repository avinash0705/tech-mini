import { createContext, useContext } from 'react';

const LoggerContext = createContext(null);

const LoggerProvider = ({ instance, children }) => {
    return <LoggerContext.Provider value={instance}>{children}</LoggerContext.Provider>;
};

const useLogger = () => {
    const value = useContext(LoggerContext);
    if (!value) {
        // throw new Error('Logger Context Provider is missing');
    }
    return value;
};

export { useLogger, LoggerProvider, LoggerContext };
