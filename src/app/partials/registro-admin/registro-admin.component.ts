import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
declare var $:any;

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit{
  @Input() rol: string = "";
  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public admin:any= {};
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;

  constructor(
    private location : Location,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private administradoresService: AdministradoresService
  ){

  }

  ngOnInit() {
    this.admin = this.administradoresService.esquemaAdmin();
    this.admin.rol = this.rol;
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista obtiene el usuario por su ID
      //this.obtenerUserByID();
    }
    //Imprimir datos en consola
    console.log("Admin: ", this.admin);
  }

  public regresar(){
    this.location.back();
  }

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar(){
     //Validar
     this.errors = [];

     this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
     if(!$.isEmptyObject(this.errors)){
       return false;
     }
     //Validar la contraseña
     if(this.admin.password == this.admin.confirmar_password){
       //Aquí si todo es correcto vamos a registrar - aquí se manda a llamar al servicio
       this.administradoresService.registrarAdmin(this.admin).subscribe(
         (response)=>{
           alert("Usuario registrado correctamente");
           console.log("Usuario registrado: ", response);
           this.router.navigate(["/"]);
         }, (error)=>{
           alert("No se pudo registrar usuario");
         }
       )
     }else{
       alert("Las contraseñas no coinciden");
       this.admin.password="";
       this.admin.confirmar_password="";
     }
  }

  public actualizar(){

  }

}
