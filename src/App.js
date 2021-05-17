import JokeList from "./JokeList";
import styled from 'styled-components'
import "./App.scss";


function App() {
  return (
    <div className='App'>
      {/* <Container > */}
      <JokeList />
      {/* </Container> */}
    </div>
  );
}


const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;  
`

export default App;
