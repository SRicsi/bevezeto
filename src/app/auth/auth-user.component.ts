export class AuthUser {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public permissions: string[],
        private _token: string,
        private _tokenExpirationDate: Date
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }

    get expirationDate() {
        return this._tokenExpirationDate;
    }

    isAdmin(): boolean {
        return this.permissions.includes('ADMIN');
    }
}