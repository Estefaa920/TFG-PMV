import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICompra } from 'app/entities/compra/compra.model';
import { GeneralService } from '../service/formulario-general.service';
import { CompraService } from '../../entities/compra/service/compra.service';
import { IAforo } from '../../entities/aforo/aforo.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from 'dayjs/esm';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'jhi-resumenmodal',
  templateUrl: './resumen-modal.component.html',
})
export class ResumenComponent implements OnInit {
  titulo!: string;
  compraFinal: ICompra = {};
  compraRecibida: ICompra | undefined = {};
  aforos?: IAforo[];

  constructor(
    public activeModal: NgbActiveModal,
    public servicioGeneral: GeneralService,
    protected servicioCompra: CompraService,
    protected router: Router,
    
  ) {
    this.aforos = servicioGeneral.getAforo();
    this.compraFinal = this.servicioGeneral.getCompra();
    this.servicioGeneral.calcularPrecioTotal();
  }
  ngOnInit(): void {
    this.titulo = 'Resumen de la compra';
  }

  cerrarModal(): void {
    this.activeModal.close('true');
  }

  guardarCompra(): void {

   
    this.activeModal.close();

    if (
      
      this.compraFinal.nombre === '' ||
      this.compraFinal.nombre === undefined ||
      this.compraFinal.precioTotal === 0 ||
      this.compraFinal.precioTotal === undefined ||
      this.compraFinal.proyeccion === undefined ||
      this.compraFinal.aforos === undefined
    ) {
      alert('La reserva no esta guardado de forma correcta');
      return;
    }


    
    this.servicioCompra.create(this.compraFinal).subscribe({
      next: (compra: HttpResponse<ICompra>) => {
        this.compraRecibida = compra.body ?? undefined;
        alert('Compra Exitosa');
        this.crearPDFFactura(this.compraFinal);

        this.router.navigate(['/']);
      },
      error: () => {
        alert('No se realizar la compra. Error Servidor contacte con el administrador.');
        this.router.navigate(['formulario']);
        this.aforos;
      },
    });
  }

  crearPDFFactura(compra: ICompra): void {
    const butacas: string[] = [];
    let butac = '';

    for (const butaca of compra.aforos!) {
      butacas.push(butaca.butaca!.posicion!);
      butac = butac.concat(butaca.butaca!.posicion!.toString());

      butac = butac.concat(', '.toString());
    }

    const entrada = butacas.length;

    const rows = [['Descripcion', 'Cantidad', 'Precio Unitario', 'Precio']];
    rows.push(['Entrada', String(entrada), String(compra.proyeccion!.precio!), String(entrada * compra.proyeccion!.precio!)]);

    let Subtotal = 0;
    let IVA = 0;
    let total = 0;

    for (let i = 0; i < compra.pedidos!.length; i++) {
      rows.push([
        compra.pedidos![i].producto!.nombre!,
        String(compra.pedidos![i].cantidad!),
        String(compra.pedidos![i].producto!.precio!),
        String(compra.pedidos![i].cantidad! * compra.pedidos![i].producto!.precio!),
      ]);
      Subtotal += compra.pedidos![i].cantidad! * compra.pedidos![i].producto!.precio!;
    }

    Subtotal += entrada * compra.proyeccion!.precio!;
    IVA = Number((Subtotal * 0.21).toFixed(2));
    total = Subtotal + IVA;

    const PDFFactuta: any = {
      pageSize: 'A7',
      content: [
        {
          text: 'Cinex',
          style: 'header',
          alignment: 'center',
          fontSize: 8,
          margin: [0, 0],
        },
        {
          text: 'Factura cines',
          alignment: 'center',
          fontSize: 5,
        },
        {
          text: '===============================================',
          alignment: 'center',
          fontSize: 5,
        },

        {
          text: `Proyeccion:  ${compra.proyeccion!.pelicula!.nombre!}   Fecha: ${dayjs().format('DD/MMM/YY HH:mm')}`,
          fontSize: 5,
        },

        {
          text: '===============================================',
          alignment: 'center',
          fontSize: 5,
        },

        {
          text: `Nombre: ${compra.nombre!}`,
          fontSize: 5,
        },

        {
          text: `DNI: ${compra.dni!}`,
          fontSize: 5,
        },

        {
          text: `Butaca: ${butac}`,
          fontSize: 5,
        },

        {
          fontSize: 5,
          table: {
            headerRows: 1,
            body: rows,
          },

          layout: 'headerLineOnly',
        },

        {
          text: '===============================================',
          alignment: 'center',
          fontSize: 5,
        },

        {
          text: `SubTotal :   ${Subtotal}`,
          fontSize: 5,
        },

        {
          text: `IVA :   ${IVA}`,
          fontSize: 5,
        },

        {
          text: `Total :   ${total}`,
          fontSize: 5,
        },

        {
          text: 'Muchas Gracias por su compra!',
          italics: true,
          fontSize: 5,
        },
      ],

      styles: {
        header: {
          fontSize: 6,
          bold: true,
          alignment: 'justify',
        },
      },
    };

    const pdf = pdfMake.createPdf(PDFFactuta);
    pdf.open();
  }
}
