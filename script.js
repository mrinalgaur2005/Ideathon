const obj = {
     firstname : "pehla",
     lastname : "aakhri",

    fullname(){
        console.log(this.firstname + " " + this.lastname);
    }
};

obj.fullname();     