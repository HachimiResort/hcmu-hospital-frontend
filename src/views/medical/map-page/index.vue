<template>
  <div class="container">
    <Breadcrumb :items="['menu.medical', 'menu.medical.mapPage']" />
    <a-row :gutter="16" class="map-grid">
      <a-col :xs="24" :lg="8">
        <a-card class="general-card" :title="$t('mapPage.mapList.title')">
          <template #extra>
            <a-space>
              <a-button type="primary" @click="handleCreateMap">
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('mapPage.mapList.create') }}
              </a-button>
              <a-button @click="refreshAll">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('mapPage.actions.refresh') }}
              </a-button>
            </a-space>
          </template>
          <a-table
            v-model:selected-keys="selectedMapKeys"
            row-key="mapId"
            :columns="mapColumns"
            :data="maps"
            :loading="loading"
            :bordered="false"
            :pagination="false"
            :row-selection="mapRowSelection"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #operations="{ record }">
              <a-space>
                <a-button
                  type="text"
                  size="small"
                  @click="handleEditMap(record)"
                >
                  {{ $t('mapPage.actions.edit') }}
                </a-button>
                <a-button
                  type="text"
                  size="small"
                  status="danger"
                  @click="handleDeleteMap(record)"
                >
                  {{ $t('mapPage.actions.delete') }}
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="16">
        <a-card class="general-card" :title="$t('mapPage.preview.title')">
          <template #extra>
            <a-space v-if="currentMap">
              <a-button @click="handleEditMap(currentMap)">
                {{ $t('mapPage.actions.edit') }}
              </a-button>
              <a-button status="danger" @click="handleDeleteMap(currentMap)">
                {{ $t('mapPage.actions.delete') }}
              </a-button>
            </a-space>
          </template>

          <div v-if="!currentMap" class="empty-state">
            <a-empty :description="$t('mapPage.preview.empty')" />
          </div>
          <div v-else class="map-preview">
            <div class="map-meta">
              <div>
                <div class="map-title">{{ currentMap.mapName }}</div>
                <div class="map-id">
                  {{ $t('mapPage.preview.mapId') }}: {{ currentMap.mapId }}
                </div>
              </div>
              <div class="map-stats">
                <a-tag>{{ mapPoints.length }}</a-tag>
                <span class="map-stats-label">{{
                  $t('mapPage.tabs.points')
                }}</span>
                <a-tag>{{ mapEdges.length }}</a-tag>
                <span class="map-stats-label">{{
                  $t('mapPage.tabs.edges')
                }}</span>
              </div>
            </div>
            <div class="map-legend">
              <span class="map-legend-title">{{
                $t('mapPage.preview.legend')
              }}</span>
              <span class="legend-item type-0">
                {{ $t('mapPage.pointType.path') }}
              </span>
              <span class="legend-item type-1">
                {{ $t('mapPage.pointType.room') }}
              </span>
              <span class="legend-item type-2">
                {{ $t('mapPage.pointType.teleport') }}
              </span>
            </div>
            <div class="map-canvas">
              <div v-if="!mapImageSrc" class="map-empty">
                {{ $t('mapPage.preview.noImage') }}
              </div>
              <template v-else>
                <img
                  ref="mapImageRef"
                  class="map-image"
                  :src="mapImageSrc"
                  @load="handleImageLoad"
                />
                <svg
                  class="edge-layer"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    v-for="edge in mapEdgeLines"
                    :key="edge.edgeId"
                    class="edge-line"
                    :x1="edge.x1"
                    :y1="edge.y1"
                    :x2="edge.x2"
                    :y2="edge.y2"
                  />
                </svg>
                <div
                  class="map-click-layer"
                  :class="{ active: interactionMode === 'point' }"
                  @click="handleMapClick"
                />
                <div class="point-layer">
                  <template v-for="point in mapPoints" :key="point.pointId">
                    <a-popover
                      v-if="interactionMode === 'none'"
                      trigger="hover"
                      position="top"
                      :title="getPointLabel(point)"
                      @popup-visible-change="handlePointHover(point, $event)"
                    >
                      <span
                        class="point-dot"
                        :class="[
                          `type-${point.type}`,
                          { active: point.pointId === edgeDraft.fromPointId },
                        ]"
                        :style="getPointStyle(point)"
                        @click.stop="handlePointClick(point)"
                      />
                      <template #content>
                        <div class="qr-panel">
                          <a-spin :loading="qrLoading[point.pointId]">
                            <img
                              v-if="qrMap[point.pointId]"
                              class="qr-image"
                              :src="qrMap[point.pointId]"
                              alt="qr"
                            />
                            <div
                              v-else-if="qrError[point.pointId]"
                              class="qr-error"
                            >
                              {{ $t('mapPage.qr.error') }}
                            </div>
                            <div v-else class="qr-placeholder">
                              {{ $t('mapPage.qr.loading') }}
                            </div>
                          </a-spin>
                        </div>
                      </template>
                    </a-popover>
                    <a-tooltip v-else :content="getPointLabel(point)">
                      <span
                        class="point-dot"
                        :class="[
                          `type-${point.type}`,
                          { active: point.pointId === edgeDraft.fromPointId },
                        ]"
                        :style="getPointStyle(point)"
                        @click.stop="handlePointClick(point)"
                      />
                    </a-tooltip>
                  </template>
                </div>
              </template>
            </div>
            <div v-if="interactionMode !== 'none'" class="map-hint">
              <template v-if="interactionMode === 'point'">
                {{ $t('mapPage.hint.pointMode') }}
              </template>
              <template v-else>
                {{ $t('mapPage.hint.edgeMode') }}
                <span v-if="edgeDraft.fromPointId" class="hint-strong">
                  {{ pointNameById(edgeDraft.fromPointId) }}
                </span>
              </template>
            </div>
          </div>
        </a-card>

        <a-card class="general-card map-detail-card">
          <a-tabs default-active-key="points" type="rounded">
            <a-tab-pane key="points" :title="$t('mapPage.tabs.points')">
              <div class="tab-actions">
                <a-space>
                  <a-button
                    :type="
                      interactionMode === 'point' ? 'primary' : 'secondary'
                    "
                    @click="togglePointMode"
                  >
                    <template #icon>
                      <icon-location />
                    </template>
                    {{ $t('mapPage.actions.addPointByClick') }}
                  </a-button>
                  <a-button type="primary" @click="handleCreatePoint">
                    <template #icon>
                      <icon-plus />
                    </template>
                    {{ $t('mapPage.actions.addPoint') }}
                  </a-button>
                </a-space>
              </div>
              <div class="tab-actions">
                <a-button
                  v-if="interactionMode !== 'none'"
                  status="danger"
                  @click="cancelInteractionMode"
                >
                  {{ $t('mapPage.actions.cancelMode') }}
                </a-button>
              </div>
              <a-table
                row-key="pointId"
                :columns="pointColumns"
                :data="mapPoints"
                :loading="loading"
                :bordered="false"
                :pagination="false"
              >
                <template #index="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
                <template #type="{ record }">
                  <a-tag :class="`tag-${record.type}`">
                    {{ pointTypeLabel(record.type) }}
                  </a-tag>
                </template>
                <template #operations="{ record }">
                  <a-space>
                    <a-button
                      type="text"
                      size="small"
                      @click="handleEditPoint(record)"
                    >
                      {{ $t('mapPage.actions.edit') }}
                    </a-button>
                    <a-button
                      type="text"
                      size="small"
                      status="danger"
                      @click="handleDeletePoint(record)"
                    >
                      {{ $t('mapPage.actions.delete') }}
                    </a-button>
                  </a-space>
                </template>
              </a-table>
            </a-tab-pane>

            <a-tab-pane key="edges" :title="$t('mapPage.tabs.edges')">
              <div class="tab-actions">
                <a-space>
                  <a-button
                    :type="interactionMode === 'edge' ? 'primary' : 'secondary'"
                    @click="toggleEdgeMode"
                  >
                    <template #icon>
                      <icon-share-alt />
                    </template>
                    {{ $t('mapPage.actions.addEdgeByClick') }}
                  </a-button>
                  <a-button type="primary" @click="handleCreateEdge">
                    <template #icon>
                      <icon-plus />
                    </template>
                    {{ $t('mapPage.actions.addEdge') }}
                  </a-button>
                </a-space>
              </div>
              <div class="tab-actions">
                <a-button
                  v-if="interactionMode !== 'none'"
                  status="danger"
                  @click="cancelInteractionMode"
                >
                  {{ $t('mapPage.actions.cancelMode') }}
                </a-button>
              </div>
              <a-table
                row-key="edgeId"
                :columns="edgeColumns"
                :data="mapEdges"
                :loading="loading"
                :bordered="false"
                :pagination="false"
              >
                <template #index="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
                <template #fromPoint="{ record }">
                  {{ pointNameById(record.fromPointId) }}
                </template>
                <template #toPoint="{ record }">
                  {{ pointNameById(record.toPointId) }}
                </template>
                <template #operations="{ record }">
                  <a-space>
                    <a-button
                      type="text"
                      size="small"
                      @click="handleEditEdge(record)"
                    >
                      {{ $t('mapPage.actions.edit') }}
                    </a-button>
                    <a-button
                      type="text"
                      size="small"
                      status="danger"
                      @click="handleDeleteEdge(record)"
                    >
                      {{ $t('mapPage.actions.delete') }}
                    </a-button>
                  </a-space>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>

    <MapModal
      :visible="mapModalVisible"
      :is-edit="isMapEdit"
      :map-id="activeMapId"
      @cancel="handleMapModalCancel"
      @success="handleMapModalSuccess"
    />
    <MapPointModal
      :visible="pointModalVisible"
      :is-edit="isPointEdit"
      :point-id="activePointId"
      :map-options="mapOptions"
      :default-map-id="selectedMapId"
      :initial-point="draftPoint"
      @cancel="handlePointModalCancel"
      @success="handlePointModalSuccess"
    />
    <MapEdgeModal
      :visible="edgeModalVisible"
      :is-edit="isEdgeEdit"
      :edge-id="activeEdgeId"
      :point-options="mapPointOptions"
      :initial-edge="draftEdge"
      @cancel="handleEdgeModalCancel"
      @success="handleEdgeModalSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    watch,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, Modal, type TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    deleteMap,
    deleteMapPoint,
    deleteMapEdge,
    getAllMapEdges,
    getAllMapPoints,
    getAllMaps,
    MapEdgeListDTO,
    MapListDTO,
    MapPointListDTO,
  } from '@/api/map';
  import { getCheckInCode } from '@/api/appointment';
  import MapModal from './components/map-modal.vue';
  import MapPointModal from './components/map-point-modal.vue';
  import MapEdgeModal from './components/map-edge-modal.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);

  const mapImageRef = ref<HTMLImageElement | null>(null);
  const maps = ref<MapListDTO[]>([]);
  const points = ref<MapPointListDTO[]>([]);
  const edges = ref<MapEdgeListDTO[]>([]);

  const selectedMapId = ref<number | null>(null);
  const selectedMapKeys = ref<number[]>([]);

  const imageSize = reactive({ width: 0, height: 0 });
  const interactionMode = ref<'none' | 'point' | 'edge'>('none');
  const edgeDraft = reactive<{ fromPointId?: number }>({});
  const draftPoint = ref<{ mapId?: number; x?: number; y?: number }>();
  const draftEdge = ref<{ fromPointId?: number; toPointId?: number }>();
  const qrMap = reactive<Record<number, string>>({});
  const qrLoading = reactive<Record<number, boolean>>({});
  const qrError = reactive<Record<number, boolean>>({});

  const mapRowSelection = reactive({
    type: 'radio' as const,
    showCheckedAll: false,
  });

  const mapColumns = computed<TableColumnData[]>(() => [
    {
      title: t('mapPage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 70,
    },
    {
      title: t('mapPage.columns.mapName'),
      dataIndex: 'mapName',
    },
    {
      title: t('mapPage.columns.mapId'),
      dataIndex: 'mapId',
      width: 90,
    },
    {
      title: t('mapPage.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
    },
  ]);

  const pointColumns = computed<TableColumnData[]>(() => [
    {
      title: t('mapPage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 70,
    },
    {
      title: t('mapPage.columns.pointName'),
      dataIndex: 'pointName',
    },
    {
      title: t('mapPage.columns.roomCode'),
      dataIndex: 'roomCode',
      width: 120,
    },
    {
      title: t('mapPage.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
      width: 120,
    },
    {
      title: t('mapPage.columns.x'),
      dataIndex: 'x',
      width: 90,
    },
    {
      title: t('mapPage.columns.y'),
      dataIndex: 'y',
      width: 90,
    },
    {
      title: t('mapPage.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
    },
  ]);

  const edgeColumns = computed<TableColumnData[]>(() => [
    {
      title: t('mapPage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 70,
    },
    {
      title: t('mapPage.columns.fromPoint'),
      dataIndex: 'fromPoint',
      slotName: 'fromPoint',
    },
    {
      title: t('mapPage.columns.toPoint'),
      dataIndex: 'toPoint',
      slotName: 'toPoint',
    },
    {
      title: t('mapPage.columns.distance'),
      dataIndex: 'distance',
      width: 120,
    },
    {
      title: t('mapPage.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
    },
  ]);

  const currentMap = computed(() =>
    maps.value.find((map) => map.mapId === selectedMapId.value)
  );

  const mapPoints = computed(() =>
    points.value.filter((point) => point.mapId === selectedMapId.value)
  );

  const mapPointIds = computed(
    () => new Set(mapPoints.value.map((point) => point.pointId))
  );

  const mapEdges = computed(() =>
    edges.value.filter(
      (edge) =>
        mapPointIds.value.has(edge.fromPointId) &&
        mapPointIds.value.has(edge.toPointId)
    )
  );

  const mapOptions = computed(() =>
    maps.value.map((map) => ({ label: map.mapName, value: map.mapId }))
  );

  const mapPointOptions = computed(() =>
    mapPoints.value.map((point) => ({
      label: getPointLabel(point),
      value: point.pointId,
    }))
  );

  const mapImageSrc = computed(() => {
    if (!currentMap.value?.imageBase64) return '';
    const value = currentMap.value.imageBase64;
    if (value.startsWith('data:image')) {
      return value;
    }
    return `data:image/png;base64,${value}`;
  });

  const pointTypeLabel = (type: number) => {
    if (type === 1) return t('mapPage.pointType.room');
    if (type === 2) return t('mapPage.pointType.teleport');
    return t('mapPage.pointType.path');
  };

  const getPointLabel = (point: MapPointListDTO) => {
    return (
      point.pointName ||
      point.roomCode ||
      `${t('mapPage.columns.pointName')} #${point.pointId}`
    );
  };

  const pointNameById = (pointId: number) => {
    const point = points.value.find((item) => item.pointId === pointId);
    return point ? getPointLabel(point) : `#${pointId}`;
  };

  const getPointPercent = (point: MapPointListDTO) => {
    if (!imageSize.width || !imageSize.height) {
      return null;
    }
    return {
      x: (point.x / imageSize.width) * 100,
      y: (point.y / imageSize.height) * 100,
    };
  };

  const mapEdgeLines = computed(() => {
    if (!imageSize.width || !imageSize.height) {
      return [];
    }
    const pointMap = new Map<number, MapPointListDTO>();
    mapPoints.value.forEach((point) => {
      pointMap.set(point.pointId, point);
    });
    return mapEdges.value
      .map((edge) => {
        const from = pointMap.get(edge.fromPointId);
        const to = pointMap.get(edge.toPointId);
        if (!from || !to) return null;
        const fromPos = getPointPercent(from);
        const toPos = getPointPercent(to);
        if (!fromPos || !toPos) return null;
        return {
          edgeId: edge.edgeId,
          x1: fromPos.x,
          y1: fromPos.y,
          x2: toPos.x,
          y2: toPos.y,
        };
      })
      .filter(Boolean) as Array<{
      edgeId: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }>;
  });

  const getPointStyle = (point: MapPointListDTO) => {
    if (!imageSize.width || !imageSize.height) {
      return { display: 'none' };
    }
    const left = (point.x / imageSize.width) * 100;
    const top = (point.y / imageSize.height) * 100;
    return {
      left: `${left}%`,
      top: `${top}%`,
    };
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handleMapClick = (event: MouseEvent) => {
    if (interactionMode.value !== 'point') return;
    if (!selectedMapId.value) {
      Message.warning(t('mapPage.message.selectMapFirst'));
      return;
    }
    if (!mapImageRef.value || !imageSize.width || !imageSize.height) {
      return;
    }
    const rect = mapImageRef.value.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    if (
      offsetX < 0 ||
      offsetY < 0 ||
      offsetX > rect.width ||
      offsetY > rect.height
    ) {
      return;
    }
    const x = Math.round((offsetX / rect.width) * imageSize.width);
    const y = Math.round((offsetY / rect.height) * imageSize.height);
    draftPoint.value = {
      mapId: selectedMapId.value,
      x: clamp(x, 0, imageSize.width),
      y: clamp(y, 0, imageSize.height),
    };
    isPointEdit.value = false;
    activePointId.value = undefined;
    pointModalVisible.value = true;
  };

  const handlePointClick = (point: MapPointListDTO) => {
    if (interactionMode.value !== 'edge') return;
    if (!edgeDraft.fromPointId) {
      edgeDraft.fromPointId = point.pointId;
      return;
    }
    if (edgeDraft.fromPointId === point.pointId) {
      edgeDraft.fromPointId = undefined;
      return;
    }
    draftEdge.value = {
      fromPointId: edgeDraft.fromPointId,
      toPointId: point.pointId,
    };
    edgeDraft.fromPointId = undefined;
    isEdgeEdit.value = false;
    activeEdgeId.value = undefined;
    edgeModalVisible.value = true;
  };

  const handlePointHover = async (point: MapPointListDTO, visible: boolean) => {
    if (!visible || interactionMode.value !== 'none') return;
    const { pointId } = point;
    if (qrMap[pointId] || qrLoading[pointId]) return;
    qrLoading[pointId] = true;
    qrError[pointId] = false;
    try {
      const { data } = await getCheckInCode(pointId);
      const blobUrl = URL.createObjectURL(data as Blob);
      qrMap[pointId] = blobUrl;
    } catch (err) {
      qrError[pointId] = true;
    } finally {
      qrLoading[pointId] = false;
    }
  };

  const handleImageLoad = (event: Event) => {
    const target = event.target as HTMLImageElement;
    imageSize.width = target.naturalWidth || 0;
    imageSize.height = target.naturalHeight || 0;
  };

  const setSelectedMap = (mapId: number | null) => {
    selectedMapId.value = mapId;
    selectedMapKeys.value = mapId ? [mapId] : [];
  };

  const syncSelectedMap = () => {
    if (!maps.value.length) {
      setSelectedMap(null);
      return;
    }
    const exists = maps.value.some((map) => map.mapId === selectedMapId.value);
    if (!exists) {
      setSelectedMap(maps.value[0].mapId);
    } else if (selectedMapId.value) {
      setSelectedMap(selectedMapId.value);
    }
  };

  const fetchMaps = async () => {
    try {
      const { data } = await getAllMaps();
      maps.value = data;
      syncSelectedMap();
    } catch (err) {
      Message.error(t('mapPage.message.fetchMapsError'));
    }
  };

  const fetchPoints = async () => {
    try {
      const { data } = await getAllMapPoints();
      points.value = data;
    } catch (err) {
      Message.error(t('mapPage.message.fetchPointsError'));
    }
  };

  const fetchEdges = async () => {
    try {
      const { data } = await getAllMapEdges();
      edges.value = data;
    } catch (err) {
      Message.error(t('mapPage.message.fetchEdgesError'));
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchMaps(), fetchPoints(), fetchEdges()]);
    setLoading(false);
  };

  const mapModalVisible = ref(false);
  const isMapEdit = ref(false);
  const activeMapId = ref<number | undefined>(undefined);

  const pointModalVisible = ref(false);
  const isPointEdit = ref(false);
  const activePointId = ref<number | undefined>(undefined);

  const edgeModalVisible = ref(false);
  const isEdgeEdit = ref(false);
  const activeEdgeId = ref<number | undefined>(undefined);

  const handleCreateMap = () => {
    isMapEdit.value = false;
    activeMapId.value = undefined;
    mapModalVisible.value = true;
  };

  const handleEditMap = (map: MapListDTO) => {
    isMapEdit.value = true;
    activeMapId.value = map.mapId;
    mapModalVisible.value = true;
  };

  const handleDeleteMap = (map: MapListDTO) => {
    Modal.confirm({
      title: t('mapPage.actions.delete'),
      content: t('mapPage.message.deleteMapConfirm'),
      onOk: async () => {
        try {
          await deleteMap(map.mapId);
          Message.success(t('mapPage.message.deleteMapSuccess'));
          await refreshAll();
        } catch (err) {
          Message.error(t('mapPage.message.deleteMapError'));
        }
      },
    });
  };

  const handleMapModalCancel = () => {
    mapModalVisible.value = false;
  };

  const handleMapModalSuccess = async (map?: MapListDTO) => {
    mapModalVisible.value = false;
    await fetchMaps();
    if (map?.mapId) {
      setSelectedMap(map.mapId);
    }
  };

  const handleCreatePoint = () => {
    if (!selectedMapId.value) {
      Message.warning(t('mapPage.message.selectMapFirst'));
      return;
    }
    draftPoint.value = undefined;
    isPointEdit.value = false;
    activePointId.value = undefined;
    pointModalVisible.value = true;
  };

  const handleEditPoint = (point: MapPointListDTO) => {
    draftPoint.value = undefined;
    isPointEdit.value = true;
    activePointId.value = point.pointId;
    pointModalVisible.value = true;
  };

  const handleDeletePoint = (point: MapPointListDTO) => {
    Modal.confirm({
      title: t('mapPage.actions.delete'),
      content: t('mapPage.message.deletePointConfirm'),
      onOk: async () => {
        try {
          await deleteMapPoint(point.pointId);
          Message.success(t('mapPage.message.deletePointSuccess'));
          await Promise.all([fetchPoints(), fetchEdges()]);
        } catch (err) {
          Message.error(t('mapPage.message.deletePointError'));
        }
      },
    });
  };

  const handlePointModalCancel = () => {
    pointModalVisible.value = false;
    draftPoint.value = undefined;
  };

  const handlePointModalSuccess = async () => {
    pointModalVisible.value = false;
    draftPoint.value = undefined;
    await Promise.all([fetchPoints(), fetchEdges()]);
  };

  const togglePointMode = () => {
    interactionMode.value =
      interactionMode.value === 'point' ? 'none' : 'point';
    edgeDraft.fromPointId = undefined;
  };

  const toggleEdgeMode = () => {
    interactionMode.value = interactionMode.value === 'edge' ? 'none' : 'edge';
    edgeDraft.fromPointId = undefined;
  };

  const cancelInteractionMode = () => {
    interactionMode.value = 'none';
    edgeDraft.fromPointId = undefined;
  };

  const handleCreateEdge = () => {
    if (!selectedMapId.value) {
      Message.warning(t('mapPage.message.selectMapFirst'));
      return;
    }
    if (mapPoints.value.length < 2) {
      Message.warning(t('mapPage.message.needTwoPoints'));
      return;
    }
    draftEdge.value = undefined;
    isEdgeEdit.value = false;
    activeEdgeId.value = undefined;
    edgeModalVisible.value = true;
  };

  const handleEditEdge = (edge: MapEdgeListDTO) => {
    draftEdge.value = undefined;
    isEdgeEdit.value = true;
    activeEdgeId.value = edge.edgeId;
    edgeModalVisible.value = true;
  };

  const handleDeleteEdge = (edge: MapEdgeListDTO) => {
    Modal.confirm({
      title: t('mapPage.actions.delete'),
      content: t('mapPage.message.deleteEdgeConfirm'),
      onOk: async () => {
        try {
          await deleteMapEdge(edge.edgeId);
          Message.success(t('mapPage.message.deleteEdgeSuccess'));
          await fetchEdges();
        } catch (err) {
          Message.error(t('mapPage.message.deleteEdgeError'));
        }
      },
    });
  };

  const handleEdgeModalCancel = () => {
    edgeModalVisible.value = false;
    draftEdge.value = undefined;
  };

  const handleEdgeModalSuccess = async () => {
    edgeModalVisible.value = false;
    draftEdge.value = undefined;
    await fetchEdges();
  };

  watch(selectedMapKeys, (keys) => {
    if (!keys.length) {
      selectedMapId.value = null;
      return;
    }
    const nextId = Number(keys[0]);
    if (selectedMapId.value !== nextId) {
      selectedMapId.value = nextId;
    }
  });

  watch(mapImageSrc, () => {
    imageSize.width = 0;
    imageSize.height = 0;
    edgeDraft.fromPointId = undefined;
  });

  const clearQrCache = () => {
    Object.values(qrMap).forEach((url) => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
    Object.keys(qrMap).forEach((key) => {
      delete qrMap[Number(key)];
      delete qrLoading[Number(key)];
      delete qrError[Number(key)];
    });
  };

  watch(selectedMapId, () => {
    edgeDraft.fromPointId = undefined;
    clearQrCache();
  });

  onBeforeUnmount(() => {
    clearQrCache();
  });

  onMounted(() => {
    refreshAll();
  });
</script>

<script lang="ts">
  export default {
    name: 'HospitalMapPage',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px;
  }

  .map-grid {
    align-items: flex-start;
  }

  .map-preview {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .map-meta {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .map-title {
    font-size: 18px;
    font-weight: 600;
  }

  .map-id {
    color: var(--color-text-3);
    margin-top: 4px;
  }

  .map-stats {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .map-stats-label {
    color: var(--color-text-2);
    margin-right: 8px;
  }

  .map-legend {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    color: var(--color-text-2);
  }

  .map-legend-title {
    font-weight: 500;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    border-radius: 999px;
    background-color: var(--color-fill-2);
    font-size: 12px;
  }

  .legend-item::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-text-3);
  }

  .legend-item.type-0::before {
    background-color: #86909c;
  }

  .legend-item.type-1::before {
    background-color: #165dff;
  }

  .legend-item.type-2::before {
    background-color: #ff7d00;
  }

  .map-canvas {
    position: relative;
    background-color: var(--color-fill-2);
    border-radius: 8px;
    padding: 12px;
    min-height: 240px;
  }

  .map-image {
    width: 100%;
    display: block;
    border-radius: 6px;
  }

  .map-empty {
    color: var(--color-text-3);
    text-align: center;
    padding: 60px 0;
  }

  .map-click-layer {
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    bottom: 12px;
    cursor: crosshair;
    pointer-events: none;
    z-index: 2;
  }

  .map-click-layer.active {
    outline: 1px dashed rgba(22, 93, 255, 0.4);
    pointer-events: auto;
  }

  .point-layer {
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 3;
    pointer-events: none;
  }

  .edge-layer {
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    bottom: 12px;
    width: calc(100% - 24px);
    height: calc(100% - 24px);
    pointer-events: none;
    z-index: 1;
  }

  .edge-line {
    stroke: rgba(22, 93, 255, 0.55);
    stroke-width: 0.6;
  }

  .point-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #fff;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
    cursor: pointer;
    pointer-events: auto;
  }

  .point-dot.active {
    box-shadow: 0 0 0 4px rgba(255, 125, 0, 0.2);
  }

  .point-dot.type-0 {
    background-color: #86909c;
  }

  .point-dot.type-1 {
    background-color: #165dff;
  }

  .point-dot.type-2 {
    background-color: #ff7d00;
  }

  .map-detail-card {
    margin-top: 16px;
  }

  .tab-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  .tag-0 {
    background-color: rgba(134, 144, 156, 0.15);
    color: #5c6b77;
    border: 1px solid rgba(134, 144, 156, 0.3);
  }

  .tag-1 {
    background-color: rgba(22, 93, 255, 0.12);
    color: #165dff;
    border: 1px solid rgba(22, 93, 255, 0.25);
  }

  .tag-2 {
    background-color: rgba(255, 125, 0, 0.12);
    color: #ff7d00;
    border: 1px solid rgba(255, 125, 0, 0.25);
  }

  .empty-state {
    padding: 30px 0;
  }

  .map-hint {
    margin-top: 8px;
    color: var(--color-text-2);
    font-size: 12px;
  }

  .hint-strong {
    margin-left: 6px;
    color: var(--color-text-1);
    font-weight: 500;
  }

  .qr-panel {
    min-width: 140px;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qr-image {
    width: 140px;
    height: 140px;
    object-fit: contain;
  }

  .qr-placeholder,
  .qr-error {
    font-size: 12px;
    color: var(--color-text-3);
  }
</style>
