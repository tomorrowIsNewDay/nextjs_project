export default class Test extends React.Component {
    constructor(props){
        super(props)
        
    }
    static async getInitialProps (ctx){
        console.log('Test:::', ctx)
        return {
            test: '123'
        }
    }

    render() {
        
        return <div>test</div>
    }
}