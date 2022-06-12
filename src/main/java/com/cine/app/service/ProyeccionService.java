package com.cine.app.service;

import com.cine.app.domain.Proyeccion;
import com.cine.app.repository.ProyeccionRepository;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Proyeccion}.
 */
@Service
@Transactional
public class ProyeccionService {

    private final Logger log = LoggerFactory.getLogger(ProyeccionService.class);

    private final ProyeccionRepository proyeccionRepository;

    public ProyeccionService(ProyeccionRepository proyeccionRepository) {
        this.proyeccionRepository = proyeccionRepository;
    }

    /**
     * Save a proyeccion.
     *
     * @param proyeccion the entity to save.
     * @return the persisted entity.
     */
    public Proyeccion save(Proyeccion proyeccion) {
        log.debug("Request to save Proyeccion : {}", proyeccion);

        return proyeccionRepository.save(proyeccion);
    }

    /**
     * Partially update a proyeccion.
     *
     * @param proyeccion the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Proyeccion> partialUpdate(Proyeccion proyeccion) {
        log.debug("Request to partially update Proyeccion : {}", proyeccion);

        return proyeccionRepository
            .findById(proyeccion.getId())
            .map(existingProyeccion -> {
                if (proyeccion.getFecha() != null) {
                    existingProyeccion.setFecha(proyeccion.getFecha());
                }
                if (proyeccion.getPrecio() != null) {
                    existingProyeccion.setPrecio(proyeccion.getPrecio());
                }

                return existingProyeccion;
            })
            .map(proyeccionRepository::save);
    }

    /**
     * Get all the proyeccions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Proyeccion> findAll(Pageable pageable) {
        log.debug("Request to get all Proyeccions");
        return proyeccionRepository.findAll(pageable);
    }

    /**
     * Get all the proyeccions by Pelicula Id.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Proyeccion> findAllByPelicula(Long id_pelicula) {
        log.debug("Request to get all Proyeccions");
        return proyeccionRepository.findProyeccionByPeliculaID(id_pelicula);
    }

    public List<Proyeccion> findProyeccionFecha(String fecha) {
        log.debug("Request to get all Proyeccions");
        return proyeccionRepository.findProyeccionByFecha2(fecha);
    }

    /**
     * Get one proyeccion by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Proyeccion> findOne(Long id) {
        log.debug("Request to get Proyeccion : {}", id);
        return proyeccionRepository.findById(id);
    }

    /**
     * Delete the proyeccion by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Proyeccion : {}", id);
        proyeccionRepository.deleteById(id);
    }
}
