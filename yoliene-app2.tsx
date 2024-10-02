import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Upload, Trash2, Smile, Mic, Wand2, X, Edit, Check, Image, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Funciones de API (a implementar)
const apiEscanearImagen = async (datosImagen) => {
  // Implementar llamada a API de escaneo de imagen aquí
  console.log('Escaneando imagen:', datosImagen);
  return "Texto escaneado de la imagen";
};

const apiTranscribirAudio = async (datosAudio) => {
  // Implementar llamada a API de transcripción de audio aquí
  console.log('Transcribiendo audio:', datosAudio);
  return "Transcripción del audio grabado";
};

const apiMejorarConIA = async (datosIdea) => {
  // Implementar llamada a API de mejora con IA aquí
  console.log('Mejorando idea con IA:', datosIdea);
  return {
    titulos: [...datosIdea.titulos, "Título mejorado por IA"],
    descripciones: [...datosIdea.descripciones, "Descripción mejorada por IA"]
  };
};

const YolieneApp = () => {
  const [ideas, setIdeas] = useState([]);
  const [ideaActual, setIdeaActual] = useState({ titulos: [''], descripciones: [''], fecha: null });
  const [estaGrabando, setEstaGrabando] = useState(false);
  const [estaMejorando, setEstaMejorando] = useState(false);
  const [ideaEditandoId, setIdeaEditandoId] = useState(null);
  const [estaEscaneando, setEstaEscaneando] = useState(false);

  const categoriasEmoji = {
    sonrisas: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
    personas: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴'],
    animales: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
    comida: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒'],
    actividades: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱'],
    viajes: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐']
  };

  useEffect(() => {
    const ideasCargadas = JSON.parse(localStorage.getItem('ideas') || '[]');
    setIdeas(ideasCargadas);
  }, []);

  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }, [ideas]);

  const agregarIdea = () => {
    if (ideaActual.titulos.some(titulo => titulo.trim() !== '') || ideaActual.descripciones.some(desc => desc.trim() !== '')) {
      const nuevaIdea = {
        ...ideaActual,
        id: Date.now(),
        numero: ideas.length + 1,
        fechaCreacion: new Date().toISOString()
      };
      setIdeas([...ideas, nuevaIdea]);
      setIdeaActual({ titulos: [''], descripciones: [''], fecha: null });
    }
  };

  const eliminarIdea = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const manejarEscaneo = async () => {
    setEstaEscaneando(true);
    try {
      const textoEscaneado = await apiEscanearImagen("datos_de_imagen_aqui");
      setIdeaActual({
        ...ideaActual,
        descripciones: [...ideaActual.descripciones, textoEscaneado]
      });
    } catch (error) {
      console.error("Error al escanear imagen:", error);
    } finally {
      setEstaEscaneando(false);
    }
  };

  const manejarClickEmoji = (emoji) => {
    const ultimoIndiceDesc = ideaActual.descripciones.length - 1;
    const descripcionesActualizadas = [...ideaActual.descripciones];
    descripcionesActualizadas[ultimoIndiceDesc] += emoji;
    setIdeaActual({ ...ideaActual, descripciones: descripcionesActualizadas });
  };

  const manejarGrabacion = async () => {
    if (estaGrabando) {
      setEstaGrabando(false);
      try {
        const transcripcion = await apiTranscribirAudio("datos_de_audio_aqui");
        setIdeaActual({
          ...ideaActual,
          descripciones: [...ideaActual.descripciones, transcripcion]
        });
      } catch (error) {
        console.error("Error al transcribir audio:", error);
      }
    } else {
      setEstaGrabando(true);
    }
  };

  const mejorarConIA = async () => {
    setEstaMejorando(true);
    try {
      const ideaMejorada = await apiMejorarConIA(ideaActual);
      setIdeaActual(ideaMejorada);
    } catch (error) {
      console.error("Error al mejorar idea con IA:", error);
    } finally {
      setEstaMejorando(false);
    }
  };

  const agregarTitulo = () => {
    setIdeaActual({ ...ideaActual, titulos: [...ideaActual.titulos, ''] });
  };

  const agregarDescripcion = () => {
    setIdeaActual({ ...ideaActual, descripciones: [...ideaActual.descripciones, ''] });
  };

  const actualizarTitulo = (indice, valor) => {
    const nuevosTitulos = [...ideaActual.titulos];
    nuevosTitulos[indice] = valor;
    setIdeaActual({ ...ideaActual, titulos: nuevosTitulos });
  };

  const actualizarDescripcion = (indice, valor) => {
    const nuevasDescripciones = [...ideaActual.descripciones];
    nuevasDescripciones[indice] = valor;
    setIdeaActual({ ...ideaActual, descripciones: nuevasDescripciones });
  };

  const eliminarTitulo = (indice) => {
    const nuevosTitulos = ideaActual.titulos.filter((_, i) => i !== indice);
    setIdeaActual({ ...ideaActual, titulos: nuevosTitulos });
  };

  const eliminarDescripcion = (indice) => {
    const nuevasDescripciones = ideaActual.descripciones.filter((_, i) => i !== indice);
    setIdeaActual({ ...ideaActual, descripciones: nuevasDescripciones });
  };

  const comenzarEdicion = (id) => {
    setIdeaEditandoId(id);
  };

  const guardarIdeaEditada = () => {
    setIdeaEditandoId(null);
  };

  const actualizarTituloEditado = (ideaId, indiceTitle, nuevoTitulo) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, titulos: idea.titulos.map((titulo, indice) => indice === indiceTitle ? nuevoTitulo : titulo) }
        : idea
    ));
  };

  const actualizarDescripcionEditada = (ideaId, indiceDesc, nuevaDescripcion) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, descripciones: idea.descripciones.map((desc, indice) => indice === indiceDesc ? nuevaDescripcion : desc) }
        : idea
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-purple-800 text-center">Yoliene</h1>
        </header>
        
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-700">Nueva idea para video de YouTube</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              {ideaActual.titulos.map((titulo, indice) => (
                <div key={`titulo-${indice}`} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Título ${indice + 1}`}
                    value={titulo}
                    onChange={(e) => actualizarTitulo(indice, e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={() => eliminarTitulo(indice)} variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={agregarTitulo} variant="outline" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Título
              </Button>
            </div>
            <div className="space-y-4 mb-4">
              {ideaActual.descripciones.map((descripcion, indice) => (
                <div key={`descripcion-${indice}`} className="space-y-2">
                  <Textarea
                    placeholder={`Descripción ${indice + 1}`}
                    value={descripcion}
                    onChange={(e) => actualizarDescripcion(indice, e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button onClick={() => eliminarDescripcion(indice)} variant="ghost" size="sm">
                    <X className="mr-2 h-4 w-4" /> Eliminar Descripción
                  </Button>
                </div>
              ))}
              <Button onClick={agregarDescripcion} variant="outline" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Descripción
              </Button>
            </div>
            <div className="mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {ideaActual.fecha ? format(ideaActual.fecha, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={ideaActual.fecha}
                    onSelect={(fecha) => setIdeaActual({ ...ideaActual, fecha })}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={agregarIdea} className="bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" /> Guardar Idea
              </Button>
              <Button onClick={manejarEscaneo} variant="outline" className="border-purple-600 text-purple-600" disabled={estaEscaneando}>
                <Image className="mr-2 h-4 w-4" /> {estaEscaneando ? 'Escaneando...' : 'Escanear Imagen'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-purple-600 text-purple-600">
                    <Smile className="mr-2 h-4 w-4" /> Emojis
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Galería de Emojis</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="sonrisas" className="w-full">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-6">
                      {Object.keys(categoriasEmoji).map(categoria => (
                        <TabsTrigger key={categoria} value={categoria} className="text-xs">
                          {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(categoriasEmoji).map(([categoria, emojis]) => (
                      <TabsContent key={categoria} value={categoria} className="mt-4">
                        <ScrollArea className="h-[40vh]">
                          <div className="grid grid-cols-8 gap-2">
                            {emojis.map(emoji => (
                              <Button key={emoji} variant="ghost" onClick={() => manejarClickEmoji(emoji)} className="text-2xl">
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                </DialogContent>
              </Dialog>
              <Button 
                onClick={manejarGrabacion} 
                className={`${estaGrabando ? 'bg-red-500' : 'bg-blue-500'} hover:bg-opacity-80`}
              >
                <Mic className="mr-2 h-4 w-4" /> {estaGrabando ? 'Detener Grabación' : 'Grabar Audio'}
              </Button>
              <Button onClick={mejorarConIA} className="bg-green-600 hover:bg-green-700" disabled={estaMejorando}>
                <Wand2 className="mr-2 h-4 w-4" /> {estaMejorando ? 'Mejorando...' : 'Mejorar con IA'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {ideas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-purple-700">Idea {idea.numero}</CardTitle>
                {ideaEditandoId === idea.id ? (
                  <Button onClick={guardarIdeaEditada} variant="ghost" size="icon">
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => comenzarEdicion(idea.id)} variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  Creada el: {format(new Date(idea.fechaCreacion), "PPP 'a las' HH:mm", { locale: es })}
                </p>
                <h3 className="font-semibold mb-2">Títulos:</h3>
                <ul className="list-disc pl-5 mb-4">
                  {idea.titulos.map((titulo, indice) => (
                    <li key={indice} className="text-gray-700">
                      {ideaEditandoId === idea.id ? (
                        <Input
                          value={titulo}
                          onChange={(e) => actualizarTituloEditado(idea.id, indice, e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        titulo
                      )}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold mb-2">Descripciones:</h3>
                {idea.descripciones.map((descripcion, indice) => (
                  <div key={indice} className="mb-2">
                    {ideaEditandoId === idea.id ? (
                      <Textarea
                        value={descripcion}
                        onChange={(e) => actualizarDescripcionEditada(idea.id, indice, e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-gray-700">{descripcion}</p>
                    )}
                  </div>
                ))}
                <div className="mt-2">
                  <strong>Fecha programada:</strong> {idea.fecha ? format(new Date(idea.fecha), "PPP", { locale: es }) : "No programada"}
                </div>
                <Button onClick={() => eliminarIdea(idea.id)} variant="destructive" className="mt-4">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Idea
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YolieneApp;