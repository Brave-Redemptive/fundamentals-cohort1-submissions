import { useEffect, useState, type FormEvent } from 'react';
import { transactionAPI } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const [balance, setBalance] = useState<number>(0);
    const [amount, setAmount] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [statusMsg, setStatusMsg] = useState<string>('');

    const fetchBalance = async () => {
        try {
            const { data } = await transactionAPI.getBalance();
            setBalance(typeof data === 'number' ? data : data.balance); 
        } catch (err) {
            console.error("Failed to fetch balance");
        }
    };

    useEffect(() => { fetchBalance(); }, []);

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await transactionAPI.sendFunds(recipient, Number(amount));
            setStatusMsg('Transfer Successful!');
            fetchBalance(); 
            setAmount('');
            setRecipient('');
        } catch (err: any) {
            setStatusMsg('Transfer Failed: ' + (err.response?.data?.message || 'Unknown Error'));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Hello, {user?.name}</h1>
            
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                <h3>Current Balance</h3>
                <h2>${balance.toFixed(2)}</h2>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                <h3>Send Money</h3>
                {statusMsg && <p>{statusMsg}</p>}
                <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
                    <input 
                        type="email" 
                        placeholder="Recipient Email" 
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                        required
                    />
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                    />
                    <button type="submit">Transfer</button>
                </form>
            </div>
        </div>
    );
}