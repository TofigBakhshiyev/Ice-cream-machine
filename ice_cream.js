class Machine {
    constructor() {
        this.milk = 0
        this.cacao = 0
        this.buckets = undefined
        this.processing_state = true
    }

    addMilk(amount) {
        this.milk += amount
    }

    addCacao(amount) {
        this.cacao += amount
    }

    async preparingIceCream(bucket, onBucketReady){
        // ice cream preperation
        setTimeout(()=>{
            this.cacao -= (bucket.capacity * 20) / 100
            this.milk -= (bucket.capacity * 80) / 100
            bucket.milk = (bucket.capacity * 80) / 100
            bucket.cacao = (bucket.capacity * 20) / 100
            onBucketReady(bucket)
            true
        }, 500) 
    }

    async load(buckets, onBucketReady) {
        this.buckets = buckets
        var bucket_count = 0
        var time = 1000
        var count = 0
        var jobDone
        var results = await Promise.all(this.buckets.map(async (bucket) => {
            var milk = (bucket.capacity * 80) / 100
            var cacao = (bucket.capacity * 20) / 100
            count = bucket_count
            await new Promise((resolve) => {
                const timer = setInterval(() => { 
                    // waiting machine to get ingiridients from pipe
                    if (this.milk >= milk  && this.cacao >= cacao && this.processing_state === true) {       
                        clearInterval(timer);         
                        resolve(true);                 
                        jobDone = this.preparingIceCream(bucket, onBucketReady)
                        if (jobDone === true) {
                            count--
                        }
                    }
                }, time);
            })

            await new Promise((resolve=>{
                const timer = setInterval(() => { 
                    // if count is smaller, processing_state is true
                    if (count < 2) {                      
                        clearInterval(timer);         
                        resolve(true);   
                        this.processing_state = true
                    } else {
                        this.processing_state = false
                    }
                }, time);
            }))
            bucket_count++
        }))

        return new Promise(resolve => {
            resolve(results) 
        })
    }
}

(async () => {
    const buckets = [{
        capacity: 10,
        milk: 0,
        cacao: 0
    }, {
        capacity: 1000,
        milk: 0,
        cacao: 0
    }, {
        capacity: 500,
        milk: 0,
        cacao: 0
    }, {
        capacity: 4000,
        milk: 0,
        cacao: 0
    }, {
        capacity: 200,
        milk: 0,
        cacao: 0
    }, {
        capacity: 1000,
        milk: 0,
        cacao: 0
    }, {
        capacity: 300,
        milk: 0,
        cacao: 0
    }, {
        capacity: 0,
        milk: 0,
        cacao: 0
    }]


    const machine = new Machine()
    const delay = Math.random() * 100

    const job = setInterval(addIngiridientsToMachine, Math.random() * 100, Math.random() * 100, delay)
    
    function addIngiridientsToMachine(a, b)
    {   
        machine.addMilk(a)
        machine.addCacao(b)   
    }

    const onBucketReady = (bucket) => {
        console.log(`Bucket has been filled, capacity: ${bucket.capacity} milk ${bucket.milk} cacao ${bucket.cacao}`)
    }
     
    await machine.load(buckets, onBucketReady)

    clearInterval(job)
    console.log('Finished filling all the buckets')
})()