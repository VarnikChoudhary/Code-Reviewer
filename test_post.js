(async ()=>{
  try{
    const res = await fetch('http://localhost:3000/ai/get-review',{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ code: 'function sum(){return 1+1}' })
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body:\n', text);
  }catch(e){
    console.error('request error', e);
  }
})();