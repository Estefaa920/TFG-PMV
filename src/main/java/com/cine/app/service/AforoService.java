package com.cine.app.service;

import com.cine.app.domain.Aforo;
import com.cine.app.domain.Butaca;
import com.cine.app.domain.Proyeccion;
import com.cine.app.domain.Sala;
import com.cine.app.repository.AforoRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



/**
 * Service Implementation for managing {@link Aforo}.
 */
@Service
@Transactional
public class AforoService {

    private final Logger log = LoggerFactory.getLogger(AforoService.class);

    private final AforoRepository aforoRepository;

    public AforoService(AforoRepository aforoRepository) {
        this.aforoRepository = aforoRepository;
    }

    /**
     * Save a aforo.
     *
     * @param aforo the entity to save.
     * @return the persisted entity.
     */
    public Aforo save(Aforo aforo) {
        log.debug("Request to save Aforo : {}", aforo);
        return aforoRepository.save(aforo);
    }

    public void generarEntrada(List<Butaca> butacas, Proyeccion proyeccion){
        log.debug("Entra por el metodo generar entrada");
        if(butacas.size()==0 || butacas ==null){
            log.debug("LISTA BUTACAS EN EL SERVICIO ES NULL O ESTA VACIA");
            return;
        }
        for(Butaca butaca: butacas){
            Aforo aforo = new Aforo();
            aforo.setButaca(butaca);
            aforo.setProyeccion(proyeccion);
            aforo.reservada(false);
            aforoRepository.save(aforo);
        }
    }

    public void reservarbutacas(Set<Aforo> entradas){
        log.debug("Pasa por el metodo reservar butacas en aforo!!!");
        if(entradas.size()==0|| entradas == null){
            log.debug("Las butacas estan vacias o son nulas");
            return;
        }
        for(Aforo aforo: entradas){
            aforoRepository.save(aforo);
        }
        log.debug("se ha guardado correctamente las reservas");

    }

    public List<Aforo> buscarEntradas(Long id){
        log.debug("Buscar ENTRADA!!!!");
        if(id==0 || id==null){
            return null;
        }
         return aforoRepository.findEntradas(id);
    }

    /**
     * Partially update a aforo.
     *
     * @param aforo the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Aforo> partialUpdate(Aforo aforo) {
        log.debug("Request to partially update Aforo : {}", aforo);

        return aforoRepository
            .findById(aforo.getId())
            .map(existingAforo -> {
                if (aforo.getReservada() != null) {
                    existingAforo.setReservada(aforo.getReservada());
                }

                return existingAforo;
            })
            .map(aforoRepository::save);
    }

    /**
     * Get all the aforos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Aforo> findAll(Pageable pageable) {
        log.debug("Request to get all Aforos");
        return aforoRepository.findAll(pageable);
    }

    /**
     * Get one aforo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Aforo> findOne(Long id) {
        log.debug("Request to get Aforo : {}", id);
        return aforoRepository.findById(id);
    }

    /**
     * Delete the aforo by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Aforo : {}", id);
        aforoRepository.deleteById(id);
    }
}
