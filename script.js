let url = "http://localhost:3001/data"
let plc = document.querySelector(".list")
let all_per = document.querySelector(".all_per")
let any_per = document.querySelector(".any_per")
let search = document.querySelector(".search")

let buttons1 = document.querySelector(".buttons1")
let buttons2 = document.querySelector(".buttons2")
let buttons3 = document.querySelector(".buttons3")

any_per.innerHTML = 0

let backend = []

axios.get(url)
    .then(res=> {
        if(res.status ===200 || res.status === 201){
            reload(res.data , plc)
            all_per.innerHTML = res.data.length

            backend.push(...res.data)

            any_per.innerHTML = res.data.filter(item=> item.rise === true).length
            // =============== search==========================

            search.onkeyup= ()=>{
                let arr = res.data.filter(item => {
                    let name = item.name.toLowerCase()
                    let value = search.value.toLowerCase()

                    if(name.includes(value)){
                        return item
                    }
                })

                reload(arr , plc)
            }

            // ==================== premia =========================

            buttons2.onclick=()=>{
                let arr = res.data.filter(item=> item.increase === true)
                reload(arr, plc)
                buttons2.style.backgroundColor = "white"
                buttons2.style.color = "black"

                buttons1.style.backgroundColor = "transparent"
                buttons1.style.color = "white"

                buttons3.style.backgroundColor = "transparent"
                buttons3.style.color = "white"
            }

            buttons1.onclick=()=>{
                
                reload(res.data, plc)
                buttons1.style.backgroundColor = "white"
                buttons1.style.color = "black"

                buttons2.style.backgroundColor = "transparent"
                buttons2.style.color = "white"

                buttons3.style.backgroundColor = "transparent"
                buttons3.style.color = "white"
            }
            buttons3.onclick=()=>{
                let arr = res.data.filter(item=> item.salary > 1000)

                reload(arr, plc)
                buttons3.style.backgroundColor = "white"
                buttons3.style.color = "black"

                buttons1.style.backgroundColor = "transparent"
                buttons1.style.color = "white"

                buttons2.style.backgroundColor = "transparent"
                buttons2.style.color = "white"
            }

            let form = document.forms.form

            form.onsubmit=e=>{
                e.preventDefault()
                let info = {
                   increase: false,
                   rise: true
                }
            
                let fm = new FormData(form)
                fm.forEach((value, key)=>{
                   info[key] = value
                })
               
                axios.post(url, info)
                .then(res => {
                    if(res.status ===200 || res.status === 201){
                        reload(res.data , plc)
                    }
                })
                window.location.reload( )
            }
        
        }
    })

function reload(arr, plc1) {
    plc1.innerHTML = ""
    
    

    for(let item of arr){
        let list1 = document.createElement("div")
        let name = document.createElement("p")
        let salary = document.createElement("input")
        let icons = document.createElement("div")
        let img1 = document.createElement("img")
        let img2 = document.createElement("img")
        let img3 = document.createElement("img")
        
        list1.classList.add("list1")
        name.classList.add("name")
        salary.classList.add("salary")
        icons.classList.add("icons")

        name.innerHTML = item.name
        salary.value = item.salary
        


        img1.alt = ""
        img2.alt = ""
        img3.alt = ""
        img1.src = "./img/cookie_icon.svg"
        img2.src = "./img/delete_ic_icon.svg"
        img3.src = "./img/star_icon.svg"
        img1.height = "40"
        img2.height = "40"
        img3.height = "20"
 
        if(item.increase === false){
            img3.style.display = "none"
        }else{
            img3.style.display = "inline"
        }

        if(item.rise === true){
            list1.classList.add("active")
            salary.classList.add("active")
            // any_per.innerHTML = ++any_per.innerHTML
        }else{
            list1.classList.remove("active")
            salary.classList.remove("active")
        }

        name.onclick = ()=>{
            if(item.increase === true){
                img3.style.display = "none"
                axios.patch(url + "/" + item.id,{
                    increase: false
                })
            } else{
                img3.style.display = "block"
                axios.patch(url + "/" + item.id,{
                    increase: true
                })
            }
        }
 
        list1.append(name, salary, icons)
        icons.append(img1, img2, img3)
        plc1.append(list1)
        // function

        img1.onclick= ()=>{
            if(!list1.classList.contains("active")){
                list1.classList.add("active")
                salary.classList.add("active")
                any_per.innerHTML = ++any_per.innerHTML
                axios.patch(url + "/" + item.id,{
                    rise: true
                })
            } else{
                list1.classList.remove("active")
                salary.classList.remove("active")
                any_per.innerHTML = --any_per.innerHTML
                axios.patch(url + "/" + item.id,{
                    rise: false
                })
            }
        }

        img2.onclick=()=>{
            axios.delete(url + "/" + item.id)
                .then(res=> reload(res.data , plc1))
            location.reload()
        }

        salary.onkeyup= ()=>{
            axios.patch(url+ "/" + item.id,{
            salary: salary.value
            })
        }
        
        
        
    }
}

reload(backend, plc)