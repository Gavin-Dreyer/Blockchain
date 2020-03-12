import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios'
import { resetWarningCache } from 'prop-types';

function App() {
  const [chain, setChain] = useState()
  const [recipient, setRecipient] = useState()
  const [id, setId] = useState({ id: '' })

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/chain').then(res => {
      setChain(res.data.chain)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  const handleChange = e => {
    setId({ ...id, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    let filteredChain = chain.filter(item => {
      if (item.transactions.length > 0 && item.transactions[0].recipient === id.id) {
        return item
      }
    })
    setRecipient(filteredChain)
    setId({ id: '' })
  }

  console.log(recipient)
  return (
    <div className="App">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          name="id"
          value={id.id}
          onChange={e => handleChange(e)}
        />
      </form>
      <div>
        {recipient ? recipient.reduce((acc, val) => {
          return acc + val.transactions[0].amount
        }, 0) : ''}
      </div>
      <div>
        {recipient ? recipient.map(item => {
          return <div key={item.index}>
            <p>
              Block: {item.index}
            </p>
            <p>
              Time: {item.timestamp}
            </p>
            <p>
              Coins: {item.transactions[0].amount}
            </p>
          </div>
        }) : ''}
      </div>
    </div>
  );
}

export default App;
