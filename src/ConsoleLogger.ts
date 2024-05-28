import { Logger } from './types';
import chalk from 'chalk';
import util from 'node:util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function inspectAll(...optionalParams: any[]) {
    return optionalParams.map( o => util.inspect(o, {depth: 4, maxStringLength: 128, maxArrayLength: 10}));
}

export const ConsoleLogger = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (message?: any, ...optionalParams: any[]) => {
        console.log(message, ...inspectAll(optionalParams));
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (message?: any, ...optionalParams: any[]) => {
        console.log(chalk.grey(message, ...inspectAll(optionalParams)));
    },    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success: (message?: any, ...optionalParams: any[]) => {
        console.info(chalk.green(message, ...inspectAll(optionalParams)));
    },
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (message?: any, ...optionalParams: any[]) => {
        console.error(chalk.bgBlack.red(message, ...inspectAll(optionalParams)));
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (message?: any, ...optionalParams: any[]) => {
        console.warn(chalk.bgBlack.yellow(message, ...inspectAll(optionalParams)));
    }
} as Logger; 
