import './style/Snackbar.css';

export default function Snackbar({ text }) {
    return <div id="snackbar" className='show'>{text}</div>
}