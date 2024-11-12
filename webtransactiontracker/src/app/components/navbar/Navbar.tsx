import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary'>
            <div className="container-fluid">
                <Link className='navbar-brand' href='/'>TT</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav">
                        <Link href="/transactions" className="nav-link">Transactions</Link>
                        <Link href="#" className="nav-link">Home</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;

