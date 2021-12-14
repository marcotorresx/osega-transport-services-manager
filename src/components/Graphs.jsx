import React from 'react'
import ChartDate from './ChartDate'
import ChartProv from './ChartProv'
import ChartVol from './ChartVol'

const Graphs = () => {
    return (
        <div className="charts">
            <ChartDate/>
            <ChartProv/>
            <ChartVol/>
        </div>
    )
}

export default Graphs
