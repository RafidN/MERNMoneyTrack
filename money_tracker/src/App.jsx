import "./App.css";
import { useState, useEffect } from "react";

function App() {
  // react
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  // functions
  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const response = await fetch(url);
    return await response.json();
  }



  function addNewTransaction(ev) {
    //take all the things in the form and send to backend
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    console.log(url);

    const price = name.split(" ")[0];

    const res = fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length+1),
        description,
        datetime,
      }),
    }).then((res) => {
      res.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      })
    })
  }

  let balance = 0;
  for(const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance  = balance.toFixed(2);


  return (
    <main>
      <h1>
        {balance}
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="price and name"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>

        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>

        <button type="submit">Add new transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 && 
          transactions.slice().reverse().map((transaction, index) => (
            <div key={index} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? "red" : "green")}>{transaction.price}</div>
              <div className="datetime">{transaction.datetime}</div>
            </div>
          </div>
          ))}

      </div>
    </main>
  );
}

export default App;
