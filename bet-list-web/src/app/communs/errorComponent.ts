import { Router } from '@angular/router';




export class ErrorComponent {
  protected router:Router;

  constructor (router:Router) {
    this.router = router;
  }
  

  protected manageError(status:String){
    if(status === '401'){
      this.router.navigate(['/login']);
    }else{
      this.router.navigate(['/login']);

    }
  }


}
