import React, {useState} from 'react';
import Layout from '../Layout';
import Button from '@material-ui/core/Button';
import space from 'color-space';
import {toPng} from 'html-to-image';

const HomePage = (props) => {
    const [temp, setTemp] = useState({});
    const [data, setData] = useState({});

    const onChangeTemp = (e) => {
        if (e.target.name === 'mode') {
            if (e.target.value === 'hue') {
                document.getElementById('delta').removeAttribute('disabled');
                document.getElementById('delta_div').style.display = 'flex';
            } else {
                document.getElementById('delta').setAttribute('disabled', '');
                document.getElementById('delta_div').style.display = 'none';
            }
        }
        setTemp({...temp, [e.target.name]: e.target.value});
    };

    function generateColors(event) {
        event.preventDefault();
        setData(temp);
    }

    function componentToHex(c) {
        let hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    function rgbToHex(rgb) {
        return "#" + componentToHex(Math.round(rgb[0])) + componentToHex(Math.round(rgb[1])) + componentToHex(Math.round(rgb[2]));
    }

    function calculateColor(row, col) {
        let rgb;
        let l_value = parseFloat(data.color_l);
        let a_value = parseFloat(data.color_a);
        let b_value = parseFloat(data.color_b);
        let cells = parseFloat(data.cells);
        if (data.mode === 'hue') {
            let delta = row + col - (cells - 1);
            if (delta !== 0) {
                let r = Math.sqrt(a_value * a_value + b_value * b_value);
                let alpha = Math.atan2(b_value, a_value);
                let dif = parseFloat(data.delta) * delta / (cells - 1) / 57.2958;
                a_value = r * Math.cos(alpha + dif);
                b_value = r * Math.sin(alpha + dif);
            }
            rgb = space.lab.rgb([l_value, a_value, b_value]);
        } else {
            let hsv = space.lab.hsv([l_value, a_value, b_value]);
            if (cells > 1) {
                hsv[1] *= (cells - col) / cells;
                hsv[2] *= (cells - 1 - row) / (cells - 1);
                hsv[2] = 100 - (100 - hsv[2]) * (cells - col) / cells;
            }
            rgb = space.hsv.rgb([hsv[0], hsv[1], hsv[2]]);
        }
        return rgbToHex(rgb);
    }

    function download() {
        if (parseInt(data.cells) > 0) {
            let node = document.getElementById('color_table');
            toPng(node)
                .then(function (dataUrl) {
                    let download = document.createElement('a');
                    download.href = dataUrl;
                    download.download = 'download.png';
                    download.click();
                }).catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
        }
    }

    return (
        <Layout {...props}>
            {
                <div className={'h-100 background-home d-flex justify-content-center align-items-center'}>

                    <div className={'card home-card flex-row'}>
                        <div className={'mh-100 p-2'} style={{width: '180px'}}>
                            <form onSubmit={event => generateColors(event)}>
                                <input type="radio" id="hue" name="mode" value="hue" required
                                       onChange={(e) => onChangeTemp(e)}/>
                                <label htmlFor="hue">&nbsp;Hue</label>&emsp;&emsp;
                                <input type="radio" id="saturation" name="mode" value="saturation" required
                                       onChange={(e) => onChangeTemp(e)}/>
                                <label htmlFor="saturation">&nbsp;Saturation</label>
                                <div className={'form-group'}>
                                    Center color
                                    <div className={'card p-2'}>
                                        <div className="form-group d-flex align-items-end">
                                            <label htmlFor="color_l" style={{width: '20px'}}>L</label>
                                            <input type="number" className="form-control" id={'color_l'}
                                                   value={temp.color_l || ''}
                                                   onChange={(e) => onChangeTemp(e)}
                                                   min={0} max={100} name={'color_l'} step={0.01} required/>
                                        </div>
                                        <div className="form-group d-flex align-items-end">
                                            <label htmlFor="color_a" style={{width: '20px'}}>A</label>
                                            <input type="number" className="form-control" id={'color_a'}
                                                   value={temp.color_a || ''}
                                                   onChange={(e) => onChangeTemp(e)}
                                                   min={-128} max={128} name={'color_a'} step={0.01} required/>
                                        </div>
                                        <div className="form-group d-flex align-items-end">
                                            <label htmlFor="color_b" style={{width: '20px'}}>B</label>
                                            <input type="number" className="form-control" id={'color_b'}
                                                   value={temp.color_b || ''}
                                                   onChange={(e) => onChangeTemp(e)}
                                                   min={-128} max={128} name={'color_b'} step={0.01} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group d-flex align-items-end pr-2">
                                    <label htmlFor="cells" style={{width: '60px'}}>Cells</label>
                                    <input type="number" className="form-control" value={temp.cells || ''}
                                           onChange={(e) => onChangeTemp(e)}
                                           name={'cells'} min={1} max={21} id={'cells'} required/>
                                </div>
                                <div className={'form-group align-items-end pr-2'} id={'delta_div'}
                                     style={{display: 'flex'}}>
                                    <label htmlFor="delta" style={{width: '60px'}}>Delta</label>
                                    <input type="number" className="form-control" id={'delta'}
                                           value={temp.delta || ''}
                                           onChange={(e) => onChangeTemp(e)}
                                           min={0} max={180} name={'delta'} step={0.01} required/>
                                </div>
                                <div className={'d-flex justify-content-center'}>
                                    <Button variant="contained" color="default" type={'submit'}>
                                        Generate
                                    </Button>
                                </div>
                                <div className={'d-flex justify-content-center mt-3'}>
                                    <Button variant="contained" color="default" type={'button'}
                                            onClick={download}>
                                        Download
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className={'mh-100'} style={{maxWidth: 'calc(100% - 180px)'}}>
                            <div className={'table-wrap mh-100 p-2'}>
                                <table>
                                    <tbody id={'color_table'}>
                                    <tr>
                                        {Array.from({length: parseInt(data.cells) + 1}, (_, c) => c).map(col => (
                                            <td key={col} style={{width: '60px', height: '60px'}}>
                                                {col === 0 ? '' : String.fromCharCode(64 + col)}
                                            </td>
                                        ))}
                                    </tr>
                                    {Array.from({length: parseInt(data.cells)}, (_, r) => r).map(row => (
                                        <tr key={row}>
                                            {Array.from({length: parseInt(data.cells) + 1}, (_, c) => c - 1).map(col => (
                                                <td key={col} style={{padding: '5px'}}>
                                                    {col === -1 ? row + 1 : (data.mode === 'hue' && row === Math.floor((parseInt(data.cells) - 1) / 2)
                                                    && col === Math.ceil((parseInt(data.cells) - 1) / 2) ?
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            margin: '5px',
                                                            backgroundColor: calculateColor(row, col)
                                                        }}/> : <div style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            backgroundColor: calculateColor(row, col)
                                                        }}/>)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </Layout>
    );
}

export default HomePage;
