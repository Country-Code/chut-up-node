module.exports = {
    authErrors: {
        register: {
            fields: {
                missed : {
                    code: "AUTH_REGISTER_FIELDS_MISSED",
                    status: 400,
                    message: "Please Enter all the Feilds!",
                },
                invalid : {
                    code: "AUTH_REGISTER_FIELDS_INVALID",
                    status: 400,
                },
            },
            user: {
                exists : {
                    code: "AUTH_REGISTER_USER_IEXISTS",
                    status: 400,
                    message: "User already exists!",
                },
                create : {
                    code: "AUTH_REGISTER_USER_CREATE",
                    message: "Error while creating the user!",
                },
            },
        },
        login: {
            credentials: {
                code: "AUTH_LOGIN_CREDENTIALS",
                status: 401,
                message: "Invalid Email or Password!",
            }
        },
        resetPasswordRequest: {
            email: {
                code: "AUTH_RESETPWREQ_EMAIL",
                status: 404,
                message: "No user found with the email {email}!",
            },
        },
        resetPasswordAction: {
            token: {
                invalid: {
                    code: "AUTH_RESETPWACT_TOKEN_INVALID",
                    status: 404,
                    message: "No user found with the token {token}!",
                },
                expired: {
                    code: "AUTH_RESETPWACT_TOKEN_EXPIRED",
                    status: 400,
                    message: "The resetPasswordToken is expired!",
                },
            },
            password: {
                code: "AUTH_RESETPWACT_PASSWORD",
                status: 400,
                message: "The new password is required!",
            },
        },
        midlleware: {
            token: {
                missed: {
                    code: "AUTH_MIDLLEWARE_TOKEN_MISSED",
                    status: 401,
                    message: "No token provided!",
                },
                expired: {
                    code: "AUTH_MIDLLEWARE_TOKEN_EXPIRED",
                    status: 401,
                    message: "Token expired!",
                },
            },
            roles: {
                oneRole: {
                    code: "AUTH_MIDLLEWARE_ROLES_ONEROLE",
                    status: 403,
                    message: "Required roles missed!",
                },
                allRoles: {
                    code: "AUTH_MIDLLEWARE_ROLES_ALLROLES",
                    status: 403,
                    message: "At least one of the required roles missed!",
                },
            }
        }
    },
    profileErrors: {
        notfound: {
            code: "PROFILE_USER_NOTFOUND",
            status: 404,
            message: "User with id : '{userId}' is not found!",
        },
        timeout: {
            code: "PROFILE_USER_TIMEOUT",
            status: 404,
            message: "Timeout - The user is not found!",
        },
    }
}