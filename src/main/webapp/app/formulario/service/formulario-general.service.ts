import { Injectable } from '@angular/core';
import { IAforo } from 'app/entities/aforo/aforo.model';
import { ICompra } from 'app/entities/compra/compra.model';
import { IPedido } from 'app/entities/pedido/pedido.model';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { IPelicula } from '../../entities/pelicula/pelicula.model';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  public compraCarrito: ICompra = {
    pedidos: [],
  };

  setNombre(nombre: string): void {
    this.compraCarrito.nombre = nombre;
  }
  setDni(dni: string): void {
    this.compraCarrito.dni = dni;
  }
  setPrecioTotal(total: number): void {
    this.compraCarrito.precioTotal = total;
  }
  setPedidos(pedidos: IPedido[]): void {
    this.compraCarrito.pedidos = pedidos;
  }
  setAforo(aforo: IAforo[]): void {
    this.compraCarrito.aforos = aforo;
  }
  setProyeccion(proyeccion: IProyeccion): void {
    this.compraCarrito.proyeccion = proyeccion;
  }

  getNombre(): string {
    return this.compraCarrito.nombre === undefined ? '' : this.compraCarrito.nombre;
  }
  getDni(): string {
    return this.compraCarrito.dni === undefined ? '' : this.compraCarrito.dni;
  }
  getPrecioTotal(): number {
    return this.compraCarrito.precioTotal === undefined ? 0 : this.compraCarrito.precioTotal;
  }
  getPedidos(): IPedido[] {
    return this.compraCarrito.pedidos === null || this.compraCarrito.pedidos === undefined ? [] : this.compraCarrito.pedidos;
  }
  getAforo(): IAforo[] {
    return this.compraCarrito.aforos === null || this.compraCarrito.aforos === undefined ? [] : this.compraCarrito.aforos;
  }
  getProyeccion(): IProyeccion {
    return this.compraCarrito.proyeccion!;
  }
  getCompra(): ICompra {
    return this.compraCarrito;
  }

  calcularPrecioTotal(): void {
    let total = 0;
    total += this.compraCarrito.proyeccion!.precio! * this.compraCarrito.aforos!.length;
    if (this.compraCarrito.pedidos!.length > 0) {
      this.compraCarrito.pedidos!.forEach(pedido => {
        total += pedido.cantidad! * pedido.producto!.precio!;
      });
    }
    this.compraCarrito.precioTotal = total;
  }
}
