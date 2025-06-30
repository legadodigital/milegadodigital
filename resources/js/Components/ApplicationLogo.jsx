export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            width="100%"
            height="100%"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main safe body - dark grey/black stroke */}
            <rect x="5" y="10" width="50" height="40" rx="4" stroke="#333333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Door - slightly inset, lighter fill, dark stroke */}
            <rect x="10" y="15" width="40" height="30" rx="2" fill="#555555" fillOpacity="0.3" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Dial - gold/brass color */}
            <circle cx="30" cy="30" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="30" cy="30" r="2" fill="#B8860B"/> {/* Inner dial dot */}

            {/* Handle/Lever - gold/brass color */}
            <rect x="40" y="28" width="8" height="4" rx="1" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Rivets/Bolts - silver/steel color */}
            <circle cx="12" cy="18" r="1.5" fill="#C0C0C0"/>
            <circle cx="48" cy="18" r="1.5" fill="#C0C0C0"/>
            <circle cx="12" cy="42" r="1.5" fill="#C0C0C0"/>
            <circle cx="48" cy="42" r="1.5" fill="#C0C0C0"/>
        </svg>
    );
}