<?php

class ContainersGetListProccessor extends modObjectGetListProcessor {

    public $classKey = 'modResource';
    public $languageTopics = array('gridclasskey:cmp');
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'gridclasskey.ContainersGetList';

    /**
     * {@inheritDoc}
     * @return boolean
     */
    public function initialize() {
        $this->editAction = $this->modx->getObject('modAction', array(
            'namespace' => 'core',
            'controller' => 'resource/update',
        ));
        return parent::initialize();
    }

    /**
     * Can be used to adjust the query prior to the COUNT statement
     *
     * @param xPDOQuery $c
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $query = $this->getProperty('query');
        if (!empty($query)) {
            $c->andCondition(array(
                'modResource.pagetitle:LIKE' => '%' . $query . '%',
                'OR:modResource.longtitle:LIKE' => '%' . $query . '%',
                'OR:modResource.menutitle:LIKE' => '%' . $query . '%',
                'OR:modResource.description:LIKE' => '%' . $query . '%',
            ));
        }

        $c->where(array(
            'class_key' => 'GridContainer'
        ));

        return $c;
    }

    /**
     * Prepare the row for iteration
     * @param xPDOObject $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
        $resourceArray = parent::prepareRow($object);

        foreach ($resourceArray as $field => $value) {
            if (!in_array($field, array('id', 'pagetitle', 'published', 'deleted', 'hidemenu', 'isfolder', 'publishedon', 'properties'))) {
                unset($resourceArray[$field]);
                continue;
            }
            // avoid null on returns
            $resourceArray[$field] = $resourceArray[$field] !== null ? $resourceArray[$field] : '';
        }

        $settings = $object->getProperties('gridclasskey');
        if (is_array($settings) && !empty($settings)) {
            foreach ($settings as $k => $v) {
                $resourceArray['gridclasskey-property-' . $k] = $v;
            }
        }

        if (isset($resourceArray['publishedon'])) {
            $publishedon = strtotime($resourceArray['publishedon']);
            $resourceArray['publishedon_date'] = strftime($this->modx->getOption('gridclasskey.mgr_date_format', null, '%b %d'), $publishedon);
            $resourceArray['publishedon_time'] = strftime($this->modx->getOption('gridclasskey.mgr_time_format', null, '%H:%I %p'), $publishedon);
            $resourceArray['publishedon'] = strftime('%b %d, %Y %H:%I %p', $publishedon);
        }

        $resourceArray['action_edit'] = '?a=' . $this->editAction->get('id') . '&id=' . $resourceArray['id'];

        $this->modx->getContext($resourceArray['context_key']);
        $resourceArray['preview_url'] = $this->modx->makeUrl($resourceArray['id'], $resourceArray['context_key'], null, 'full');

        $c = $this->modx->newQuery('modResource');
        $c->where(array(
            'parent' => $resourceArray['id']
        ));
        $c->limit(1);
        $resourceArray['has_children'] = (bool) $this->modx->getCount('modResource', $c);

        return $resourceArray;
    }

}

return 'ContainersGetListProccessor';