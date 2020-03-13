import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';

function App() {
	const [chain, setChain] = useState();
	const [recipient, setRecipient] = useState();
	const [currentAccount, setCurrentAccount] = useState();
	const [transactions, setTransactions] = useState([]);
	const [id, setId] = useState({ id: '' });

	useEffect(() => {
		axios
			.get('http://127.0.0.1:5000/chain')
			.then(res => {
				res.data.chain.forEach(item => {
					if (item.transactions.length > 0) {
						item.transactions.forEach(item2 => {
							item2.amount = Number(item2.amount);
						});
					}
				});
				setChain(res.data.chain);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	const handleChange = e => {
		setId({ ...id, [e.target.name]: e.target.value });
	};

	const handleSubmit = e => {
		e.preventDefault();
		chain.forEach(item => {
			if (item.transactions.length > 0) {
				setTransactions(transactions => [
					...transactions,
					...item.transactions
				]);
			}
		});
		let filteredChain = chain.filter(item => {
			if (
				item.transactions.length > 0 &&
				item.transactions[0].recipient === id.id
			) {
				return item;
			}
		});
		setRecipient(filteredChain);
		setCurrentAccount(id.id);
		setId({ id: '' });
	};

	console.log(transactions);
	return (
		<div className="App">
			<form onSubmit={e => handleSubmit(e)}>
				<input
					className="input"
					type="text"
					name="id"
					value={id.id}
					onChange={e => handleChange(e)}
				/>
			</form>
			<div>{currentAccount}</div>
			<div className="mainCon">
				<div className="transactions">
					Current Amount:{' '}
					{transactions
						? transactions.reduce((acc, val) => {
								if (val.recipient === currentAccount) {
									return acc + val.amount;
								} else if (val.sender === currentAccount) {
									return acc - val.amount;
								} else {
									return acc;
								}
						  }, 0)
						: ''}
					{transactions
						? transactions.map(item => {
								if (
									item.sender !== '0' &&
									(currentAccount === item.sender ||
										currentAccount === item.recipient)
								) {
									return (
										<div className="eaTransaction">
											<p>Recipient: {item.recipient}</p>
											<p>Sender: {item.sender}</p>
											<p>Amount: {item.amount}</p>
										</div>
									);
								}
						  })
						: ''}
				</div>
				<div className="minig">
					Blocks Mined: {recipient ? recipient.length : ''}
					{recipient
						? recipient.map(item => {
								return (
									<div key={item.index} className="eaBlock">
										<p>Block: {item.index}</p>
										<p>Time: {item.timestamp}</p>
										<p>Coins: {item.transactions[0].amount}</p>
									</div>
								);
						  })
						: ''}
				</div>
			</div>
		</div>
	);
}

export default App;
