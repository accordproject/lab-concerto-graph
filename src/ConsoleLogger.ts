import { Logger } from './types';
import chalk from 'chalk';

export const ConsoleLogger = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (message?: any, ...optionalParams: any[]) => {
        console.log(message, ...optionalParams);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (message?: any, ...optionalParams: any[]) => {
        console.log(chalk.grey(message, ...optionalParams));
    },    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success: (message?: any, ...optionalParams: any[]) => {
        console.info(chalk.green(message, ...optionalParams));
    },
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (message?: any, ...optionalParams: any[]) => {
        console.error(chalk.bgBlack.red(message, ...optionalParams));
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (message?: any, ...optionalParams: any[]) => {
        console.warn(chalk.bgBlack.yellow(message, ...optionalParams));
    }
} as Logger; 
