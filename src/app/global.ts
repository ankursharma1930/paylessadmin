export class GlobalApp{
    constructor(){}

    public localstorageItem(id:string): string{
        return localStorage.getItem(id);
    }
}