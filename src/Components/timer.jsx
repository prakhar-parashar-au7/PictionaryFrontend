import react, {useState, forwardRef, useImperativeHandle} from 'react'

const Timer = forwardRef((props, ref) => {

  const [timer, setTimer] = useState(0)



    useImperativeHandle(ref, () => ({


      mantainTimer ()  {
        console.log("i")
         let myInter =  setInterval(()=> {
           setTimer(timer =>{
             console.log('timer')
             if(timer == 10) {
                 console.log("he")
               
                 clearInterval(myInter)
                 setTimer(0)
             return timer} 
             return timer +1
           } )
            
        }, 1000)
      
      }
      
         

    
}))
    

      
        
       
      
       
       
      

      return (
          <p onClick = {props.timeUp}>{timer}</p>
      )
      

})

export default Timer