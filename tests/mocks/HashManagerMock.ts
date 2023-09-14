export class HashManagerMock{
    public hash = async (
        plaintext: string
    ):Promise<string> => {
        return 'hash-mock'
    }

    public compare = async (
        plaintext: string,
        hash: string
    ):Promise<boolean> => {
        switch(plaintext){
            case 'normUser123!':
                return hash === 'hash-mock-normUser'

            case 'adminUser123!':
                return hash === 'hash-mock-adminUser'

            default:
                return false
        }
    }
}