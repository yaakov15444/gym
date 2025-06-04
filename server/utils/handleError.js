class AppError {
    constructor(message, status, error) {
        this.message = message ?? "there is an error"
        this.status = status ?? 500
        this.error = error ?? {}
    }

    print() {
        console.error("Error", {
            message: this.message,
            status: this.status,
            error: this.error,
        })
    }
}

module.exports = AppError
