function downloadFile(fname, belonging) {
    // console.log(e.innerText)
    let url = ''
    if (belonging == 'barrier')
        url = 'http://127.0.0.1:5000/api/getBarFile'
    else if (belonging == 'element') url = 'http://127.0.0.1:5000/api/getElemFile'

    const postData = {
        fName: fname
    }

    // console.log(fname)

    fetch(url, {
        body: JSON.stringify(postData),
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.ok) {
                res.blob()
                    .then(blob => {
                        console.log(blob)
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = fname;
                        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                        a.click();
                        a.remove();  //afterwards we remove the element again    
                    })
            }
        })
}


export default downloadFile