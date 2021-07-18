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
        // console.log('props',this.props)
        return <div>test</div>
    }
}