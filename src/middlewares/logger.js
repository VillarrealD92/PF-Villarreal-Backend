import winston from "winston"
import config from "../config/config.js"

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "grey",
        debug: "white",
    },
}

const environment = config.environment
let level
if (environment == "dev") {
    level = "debug"
} else {
    level = "info"
}

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: level,
            format: winston.format.combine(
            winston.format.colorize({
                colors: customLevelOptions.colors,
            }),
            winston.format.simple()
        ),
    }),
    new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.simple(),
    }),
  ],
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(
        `[${req?.method}] ${req?.url} - ${new Date().toLocaleTimeString()}`
    )
    next()
}

