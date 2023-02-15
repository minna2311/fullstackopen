import { useState } from 'react'

const StatisticLine = (props) => {
  let text = props.text
  let value = props.value

  if (text === 'positive') {
    value = value + '%'
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td style={{width: '70px'}}>{text}</td>
            <td>{value}</td>
          </tr>
        </tbody>  
      </table>
    </div>
    )
} 


const Statistics = (props) => {
  const all =props.good + props.neutral + props.bad

  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1>statistics</h1>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.neutral} />
      <StatisticLine text="bad" value ={props.bad} />
      <StatisticLine text="all" value ={all} />
      <StatisticLine text="average" value ={(props.good-props.bad)/all} />
      <StatisticLine text="positive" value ={100*props.good/all} />
    </div>
  )
}

const Button = (props) => { 
  return (
    <button onClick={props.handleClick}>
        {props.text}
      </button>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)
  
    return (
    <div>
      <h1>give feedback</h1>
      
      <Button handleClick={increaseGood} text="good" />
      <Button handleClick={increaseNeutral} text="neutral" />
      <Button handleClick={increaseBad} text="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
  
}

export default App
