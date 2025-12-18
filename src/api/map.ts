import axios from 'axios';

const base = '/maps';

export interface MapListDTO {
  mapId: number;
  mapName: string;
  imageBase64: string;
}

export interface MapCreateDTO {
  mapName: string;
  imageBase64: string;
}

export interface MapUpdateDTO {
  mapName?: string;
  imageBase64?: string;
}

export interface MapPointListDTO {
  pointId: number;
  mapId: number;
  x: number;
  y: number;
  type: number;
  pointName?: string;
  roomCode?: string;
}

export interface MapPointCreateDTO {
  mapId: number;
  x: number;
  y: number;
  type: number;
  pointName?: string;
  roomCode?: string;
}

export interface MapPointUpdateDTO {
  mapId?: number;
  x?: number;
  y?: number;
  type?: number;
  pointName?: string;
  roomCode?: string;
}

export interface MapEdgeListDTO {
  edgeId: number;
  fromPointId: number;
  toPointId: number;
  distance: number;
}

export interface MapEdgeCreateDTO {
  fromPointId: number;
  toPointId: number;
  distance: number;
}

export interface MapEdgeUpdateDTO {
  fromPointId?: number;
  toPointId?: number;
  distance?: number;
}

export function getAllMaps() {
  return axios.get<MapListDTO[]>(base);
}

export function createMap(params: MapCreateDTO) {
  return axios.post<MapListDTO>(base, params);
}

export function getMapById(mapId: number) {
  return axios.get<MapListDTO>(`${base}/${mapId}`);
}

export function updateMap(mapId: number, params: MapUpdateDTO) {
  return axios.put<string>(`${base}/${mapId}`, params);
}

export function deleteMap(mapId: number) {
  return axios.delete<string>(`${base}/${mapId}`);
}

export function getAllMapPoints() {
  return axios.get<MapPointListDTO[]>(`${base}/points`);
}

export function createMapPoint(params: MapPointCreateDTO) {
  return axios.post<MapPointListDTO>(`${base}/points`, params);
}

export function getMapPointById(pointId: number) {
  return axios.get<MapPointListDTO>(`${base}/points/${pointId}`);
}

export function updateMapPoint(pointId: number, params: MapPointUpdateDTO) {
  return axios.put<string>(`${base}/points/${pointId}`, params);
}

export function deleteMapPoint(pointId: number) {
  return axios.delete<string>(`${base}/points/${pointId}`);
}

export function getAllMapEdges() {
  return axios.get<MapEdgeListDTO[]>(`${base}/edges`);
}

export function createMapEdge(params: MapEdgeCreateDTO) {
  return axios.post<MapEdgeListDTO>(`${base}/edges`, params);
}

export function getMapEdgeById(edgeId: number) {
  return axios.get<MapEdgeListDTO>(`${base}/edges/${edgeId}`);
}

export function updateMapEdge(edgeId: number, params: MapEdgeUpdateDTO) {
  return axios.put<string>(`${base}/edges/${edgeId}`, params);
}

export function deleteMapEdge(edgeId: number) {
  return axios.delete<string>(`${base}/edges/${edgeId}`);
}
