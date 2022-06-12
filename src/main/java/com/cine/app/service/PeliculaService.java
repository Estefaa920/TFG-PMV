package com.cine.app.service;

import com.cine.app.domain.Pelicula;
import com.cine.app.repository.PeliculaRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pelicula}.
 */
@Service
@Transactional
public class PeliculaService {

    private final Logger log = LoggerFactory.getLogger(PeliculaService.class);

    private final PeliculaRepository peliculaRepository;

    public PeliculaService(PeliculaRepository peliculaRepository) {
        this.peliculaRepository = peliculaRepository;
    }

    /**
     * Save a pelicula.
     *
     * @param pelicula the entity to save.
     * @return the persisted entity.
     */
    public Pelicula save(Pelicula pelicula) {
        log.debug("Request to save Pelicula : {}", pelicula);
        return peliculaRepository.save(pelicula);
    }

    /**
     * Partially update a pelicula.
     *
     * @param pelicula the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Pelicula> partialUpdate(Pelicula pelicula) {
        log.debug("Request to partially update Pelicula : {}", pelicula);

        return peliculaRepository
            .findById(pelicula.getId())
            .map(existingPelicula -> {
                if (pelicula.getNombre() != null) {
                    existingPelicula.setNombre(pelicula.getNombre());
                }
                if (pelicula.getDescripcion() != null) {
                    existingPelicula.setDescripcion(pelicula.getDescripcion());
                }
                if (pelicula.getDuracion() != null) {
                    existingPelicula.setDuracion(pelicula.getDuracion());
                }
                if (pelicula.getEnCartelera() != null) {
                    existingPelicula.setEnCartelera(pelicula.getEnCartelera());
                }

                return existingPelicula;
            })
            .map(peliculaRepository::save);
    }

    /**
     * Get all the peliculas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Pelicula> findAll(Pageable pageable) {
        log.debug("Request to get all Peliculas");
        return peliculaRepository.findAll(pageable);
    }

    /**
     * Get one pelicula by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Pelicula> findOne(Long id) {
        log.debug("Request to get Pelicula : {}", id);
        return peliculaRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Page<Pelicula> findActivesPeliculaByName(Pageable pageable, String nombre) {
        log.debug("Request to get Peliculas by Nombre");
        return peliculaRepository.findActivesPeliculaByName(nombre, pageable);
    }

    public List<Pelicula> findCartelera() {
        return peliculaRepository.findCartelera();
    }

    public List<Pelicula> findPelicula() {
        return peliculaRepository.findAll();
    }

    /**
     * Delete the pelicula by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Pelicula : {}", id);
        peliculaRepository.deleteById(id);
    }
}
