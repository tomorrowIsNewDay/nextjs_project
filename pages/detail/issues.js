import withRepoBasic from '../../components/with-repo-basic'

function Issues({text}) {
    return (
        <div>四速度速度{text}</div>
    )
}

Issues.getInitialProps = async() => {
    return {
        text: 123
    }
}

export default withRepoBasic(Issues, 'issues')