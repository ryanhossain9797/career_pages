import { CURRENT_YEAR } from '../constants/app'
import './Footer.css'

export function Footer() {
    return (
        <footer>
            <div className="footer-item" style={{ gridColumn: 'span 2' }}>
                <div className="copyright">COPYRIGHT © {CURRENT_YEAR} BD ENG CAREERS. ALL RIGHTS RESERVED.</div>
            </div>
        </footer>
    )
}
