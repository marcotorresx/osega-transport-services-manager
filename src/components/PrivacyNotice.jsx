import React from 'react'
import "./PrivacyNotice.css"

const PrivacyNotice = () => {
    return (
        <div className="pn_container">
            <div className="pn_card">
                <h1>Aviso de Privacidad</h1>
                <p>En Geax, creemos que puedes disfrutar de nuestros productos con privacidad. Es decir, aspiramos a recoger únicamente los datos personales que necesitamos.</p>
                <p>- Información sobre la ubicación.</p>
                <p>- Ubicación exacta - Solo para verificar el lugar de entrega.</p>
                <p>- Foto ID - Solo para verificar que hay un responsable de recibir el agua.</p>
                <p>La información recabada es solo para uso de Geax y no es compartida con nadie mas.</p>
            </div>
        </div>
    )
}

export default PrivacyNotice
