'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Curso, Profesional, Rol } from '@/types';

function mapCurso(row: Record<string, unknown>): Curso {
  return {
    id:           row.id as string,
    nombre:       row.nombre as string,
    cantidadNEEP: row.cantidad_neep as number,
    cantidadNEET: row.cantidad_neet as number,
    tieneJEC:     row.tiene_jec as boolean,
    createdAt:    row.created_at as string,
    updatedAt:    row.updated_at as string,
  };
}

function mapProfesional(row: Record<string, unknown>): Profesional {
  return {
    id:            row.id as string,
    nombre:        row.nombre as string,
    rol:           row.rol as Rol,
    horasContrato: row.horas_contrato as number,
    horasApoyo:    row.horas_apoyo as number,
    createdAt:     row.created_at as string,
    updatedAt:     row.updated_at as string,
  };
}

export function usePieData() {
  const [cursos,        setCursos]        = useState<Curso[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: c, error: ec }, { data: p, error: ep }] = await Promise.all([
        supabase.from('cursos').select('*').order('created_at', { ascending: true }),
        supabase.from('profesionales').select('*').order('created_at', { ascending: true }),
      ]);
      if (ec) throw new Error(ec.message);
      if (ep) throw new Error(ep.message);
      setCursos(((c as Record<string, unknown>[]) ?? []).map(mapCurso));
      setProfesionales(((p as Record<string, unknown>[]) ?? []).map(mapProfesional));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    const channelCursos = supabase
      .channel('cursos-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'cursos' },
        payload => {
          if (payload.eventType === 'INSERT') {
            setCursos(prev => [...prev, mapCurso(payload.new as Record<string, unknown>)]);
          } else if (payload.eventType === 'UPDATE') {
            setCursos(prev => prev.map(c =>
              c.id === (payload.new as Record<string, unknown>).id
                ? mapCurso(payload.new as Record<string, unknown>) : c
            ));
          } else if (payload.eventType === 'DELETE') {
            setCursos(prev => prev.filter(c =>
              c.id !== (payload.old as Record<string, unknown>).id
            ));
          }
        }
      ).subscribe();

    const channelProfs = supabase
      .channel('profesionales-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profesionales' },
        payload => {
          if (payload.eventType === 'INSERT') {
            setProfesionales(prev => [...prev, mapProfesional(payload.new as Record<string, unknown>)]);
          } else if (payload.eventType === 'UPDATE') {
            setProfesionales(prev => prev.map(p =>
              p.id === (payload.new as Record<string, unknown>).id
                ? mapProfesional(payload.new as Record<string, unknown>) : p
            ));
          } else if (payload.eventType === 'DELETE') {
            setProfesionales(prev => prev.filter(p =>
              p.id !== (payload.old as Record<string, unknown>).id
            ));
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channelCursos);
      supabase.removeChannel(channelProfs);
    };
  }, [fetchAll]);

  // ── CRUD Cursos ───────────────────────────────────────────────────────────
  const addCurso = async (data: Omit<Curso, 'id'|'createdAt'|'updatedAt'>) => {
    const { error } = await supabase.from('cursos').insert({
      nombre:        data.nombre,
      cantidad_neep: data.cantidadNEEP,
      cantidad_neet: data.cantidadNEET,
      tiene_jec:     data.tieneJEC,
    } as never);
    if (error) throw new Error(error.message);
  };

  const updateCurso = async (id: string, data: Partial<Omit<Curso,'id'|'createdAt'|'updatedAt'>>) => {
    const payload: Record<string, unknown> = {};
    if (data.nombre       !== undefined) payload.nombre        = data.nombre;
    if (data.cantidadNEEP !== undefined) payload.cantidad_neep = data.cantidadNEEP;
    if (data.cantidadNEET !== undefined) payload.cantidad_neet = data.cantidadNEET;
    if (data.tieneJEC     !== undefined) payload.tiene_jec     = data.tieneJEC;
    const { error } = await supabase.from('cursos').update(payload as never).eq('id', id);
    if (error) throw new Error(error.message);
  };

  const deleteCurso = async (id: string) => {
    const { error } = await supabase.from('cursos').delete().eq('id', id);
    if (error) throw new Error(error.message);
  };

  // ── CRUD Profesionales ────────────────────────────────────────────────────
  const addProfesional = async (data: Omit<Profesional,'id'|'createdAt'|'updatedAt'>) => {
    const { error } = await supabase.from('profesionales').insert({
      nombre:         data.nombre,
      rol:            data.rol,
      horas_contrato: data.horasContrato,
      horas_apoyo:    data.horasApoyo,
    } as never);
    if (error) throw new Error(error.message);
  };

  const updateProfesional = async (id: string, data: Partial<Omit<Profesional,'id'|'createdAt'|'updatedAt'>>) => {
    const payload: Record<string, unknown> = {};
    if (data.nombre        !== undefined) payload.nombre         = data.nombre;
    if (data.rol           !== undefined) payload.rol            = data.rol;
    if (data.horasContrato !== undefined) payload.horas_contrato = data.horasContrato;
    if (data.horasApoyo    !== undefined) payload.horas_apoyo    = data.horasApoyo;
    const { error } = await supabase.from('profesionales').update(payload as never).eq('id', id);
    if (error) throw new Error(error.message);
  };

  const deleteProfesional = async (id: string) => {
    const { error } = await supabase.from('profesionales').delete().eq('id', id);
    if (error) throw new Error(error.message);
  };

  return {
    cursos, profesionales, loading, error,
    addCurso, updateCurso, deleteCurso,
    addProfesional, updateProfesional, deleteProfesional,
  };
}
